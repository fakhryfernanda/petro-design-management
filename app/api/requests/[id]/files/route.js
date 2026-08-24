import { prisma } from '../../../../../lib/db'
import { uploadFile, deleteFile } from '../../../../../lib/storage'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf', 'image/svg+xml']
const MAX_SIZE = 50 * 1024 * 1024 // 50MB

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

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: `File type not allowed: ${file.type}` }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
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
