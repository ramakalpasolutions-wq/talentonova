// src/app/api/admin/service/route.js
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
    const description = formData.get('description')
    const imageFile = formData.get('image')

    if (!title || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    let imageUrl = ''
    if (imageFile && typeof imageFile !== 'string' && imageFile.size > 0) {
      imageUrl = await uploadToR2(imageFile, 'services')
    }

    const service = await prisma.service.create({
      data: { title, description, image: imageUrl },
    })

    return NextResponse.json({ service })
  } catch (error) {
    console.error('Add service error:', error)
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
    await prisma.service.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 })
  }
}