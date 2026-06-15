// src/app/dashboard/page.js
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from '@/components/DashboardClient'

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const bookings = await prisma.booking.findMany({
    where: { email: session.user.email },
    include: { service: true },
    orderBy: { createdAt: 'desc' },
  })

  return <DashboardClient session={session} bookings={bookings} />
}