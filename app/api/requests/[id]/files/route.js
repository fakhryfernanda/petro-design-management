import { prisma } from '../../../../../lib/db'
import { uploadFile, deleteFile } from '../../../../../lib/storage'
import { isFileAllowed, isFileTooLarge } from '../../../../../lib/files'
import { requireApiAuth, ROLES } from '../../../../../lib/auth'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  try {
    const { id } = await params
    const requestId = parseInt(id)

    if (Number.isNaN(requestId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 })
    }

    const exists = await prisma.designRequest.findUnique({ where: { id: requestId }, select: { id: true } })
    if (!exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const formData = await request.formData()
    const file = formData.get('file')

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const type = formData.get('type') === 'designer' ? 'designer' : 'reference'

    // Designer files hanya untuk super_admin/designer; reference untuk semua role yang login
    const denied = await requireApiAuth(
      type === 'designer' ? [ROLES.SUPER_ADMIN, ROLES.DESIGNER] : null
    )
    if (denied) return denied

    if (!isFileAllowed(file.type)) {
      return NextResponse.json({ error: `File type not allowed: ${file.type}` }, { status: 400 })
    }

    if (isFileTooLarge(file.size)) {
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const stored = await uploadFile({
      buffer,
      originalName: file.name,
      mimeType: file.type,
      requestId,
    })

    const record = await prisma.file.create({
      data: {
        name:      stored.name,
        url:       stored.url,
        mimeType:  stored.mimeType,
        size:      stored.size,
        type,
        requestId,
      },
    })

    return NextResponse.json(record, { status: 201 })
  } catch (err) {
    console.error('[POST /files] error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    // Hapus attachment: super_admin & designer
    const denied = await requireApiAuth([ROLES.SUPER_ADMIN, ROLES.DESIGNER])
    if (denied) return denied

    const { id } = await params
    const requestId = parseInt(id)
    const { fileId } = await request.json()

    if (Number.isNaN(requestId) || !fileId) {
      return NextResponse.json({ error: 'Invalid params' }, { status: 400 })
    }

    const file = await prisma.file.findFirst({
      where: { id: parseInt(fileId), requestId },
    })
    if (!file) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await deleteFile({ url: file.url })
    await prisma.file.delete({ where: { id: file.id } })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[DELETE /files] error:', err)
    return NextResponse.json({ error: err.message || 'Internal error' }, { status: 500 })
  }
}
