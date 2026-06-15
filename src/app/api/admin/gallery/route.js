// src/app/api/admin/gallery/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'
import { uploadToR2 } from '@/actions/upload'

export async function POST(request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const title = formData.get('title')
    const imageFile = formData.get('image')

    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 })
    }

    let imageUrl = ''
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      imageUrl = await uploadToR2(imageFile, 'gallery')
    }

    const gallery = await prisma.gallery.create({
      data: { title, imageUrl },
    })

    return NextResponse.json({ gallery })
  } catch (error) {
    console.error('Gallery error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  try {
    await prisma.gallery.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}