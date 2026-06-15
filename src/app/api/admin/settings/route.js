// src/app/api/admin/settings/route.js
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
    const contentType = request.headers.get('content-type') || ''

    // ── JSON request (for setting fee) ─────────────────
    if (contentType.includes('application/json')) {
      const { key, value } = await request.json()

      if (!key || value === undefined) {
        return NextResponse.json(
          { error: 'Missing key or value' },
          { status: 400 }
        )
      }

      const setting = await prisma.siteSettings.upsert({
        where: { key },
        update: { value: String(value) },
        create: { key, value: String(value) },
      })

      return NextResponse.json({ setting })
    }

    // ── FormData request (for image upload) ─────────────
    const formData = await request.formData()
    const key = formData.get('key')
    const imageFile = formData.get('image')

    if (!key) {
      return NextResponse.json({ error: 'Missing key' }, { status: 400 })
    }

    if (!imageFile || typeof imageFile === 'string' || imageFile.size === 0) {
      return NextResponse.json({ error: 'No image file' }, { status: 400 })
    }

    const imageUrl = await uploadToR2(imageFile, 'hero')

    const setting = await prisma.siteSettings.upsert({
      where: { key },
      update: { value: imageUrl },
      create: { key, value: imageUrl },
    })

    return NextResponse.json({ setting })
  } catch (error) {
    console.error('Settings error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const settings = await prisma.siteSettings.findMany()
    const settingsObj = {}
    settings.forEach((s) => {
      settingsObj[s.key] = s.value
    })
    return NextResponse.json(settingsObj)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ── DELETE: Remove a setting (e.g., hero image) ─────────────────
export async function DELETE(request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
      return NextResponse.json({ error: 'Key required' }, { status: 400 })
    }

    await prisma.siteSettings.deleteMany({ where: { key } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Settings delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}