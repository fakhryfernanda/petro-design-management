import { prisma } from '../../../lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true },
  })
  return NextResponse.json(tags)
}
