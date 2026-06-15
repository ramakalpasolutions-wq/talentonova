// src/app/api/admin/contact/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// ─── DELETE: Remove a contact message (Admin only) ─────────────
export async function DELETE(request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Contact ID required' },
        { status: 400 }
      )
    }

    await prisma.contact.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact delete error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete message' },
      { status: 500 }
    )
  }
}

// ─── GET: Fetch all contact messages (Admin only) ─────────────
export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json({ contacts })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}