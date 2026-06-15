// src/app/api/admin/booking/route.js
import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { prisma } from '@/lib/prisma'

// ─── GET: All bookings ─────────────
export async function GET() {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const bookings = await prisma.booking.findMany({
      orderBy: { createdAt: 'desc' },
      include: { service: true },
    })
    return NextResponse.json({ bookings })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── PATCH: Update booking status / notes ─────────────
export async function PATCH(request) {
  const session = await auth()
  if (session?.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id, status, adminNotes, meetingDate } = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const updateData = {}
    if (status) updateData.status = status
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes
    if (meetingDate !== undefined) updateData.meetingDate = meetingDate ? new Date(meetingDate) : null

    const updated = await prisma.booking.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ booking: updated })
  } catch (error) {
    console.error('Booking update error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

// ─── DELETE: Remove booking ─────────────
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

    await prisma.booking.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Booking delete error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}