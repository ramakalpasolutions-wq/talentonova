// src/app/api/admin/hero/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { uploadToR2 } from '@/actions/upload'

// ─── GET: All hero images ─────────────
export async function GET() {
  try {
    const images = await prisma.heroImage.findMany({
      orderBy: { createdAt: 'asc' },
    })
    return NextResponse.json({ images })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── POST: Add new hero image ─────────────
export async function POST(request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const imageFile = formData.get('image')
    const title = formData.get('title') || ''

    if (!imageFile || typeof imageFile === 'string' || imageFile.size === 0) {
      return NextResponse.json({ error: 'No image file' }, { status: 400 })
    }

    const imageUrl = await uploadToR2(imageFile, 'hero')

    const image = await prisma.heroImage.create({
      data: {
        imageUrl,
        title: title || null,
      },
    })

    return NextResponse.json({ image })
  } catch (error) {
    console.error('Hero upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── DELETE: Remove hero image ─────────────
export async function DELETE(request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    await prisma.heroImage.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Hero delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}