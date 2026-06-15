// src/app/admin/page.js
import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AdminClient from '@/components/AdminClient'

export default async function AdminPage() {
  const session = await auth()
  if (!session || session.user.role !== 'admin') redirect('/')

  const [services, gallery, bookings, contacts, settings, heroImages] =
    await Promise.all([
      prisma.service.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.booking.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.contact.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20,
      }),
      prisma.siteSettings.findMany(),
      prisma.heroImage.findMany({ orderBy: { createdAt: 'asc' } }),
    ])

  const settingsMap = {}
  settings.forEach((s) => {
    settingsMap[s.key] = s.value
  })

  return (
    <AdminClient
      services={services}
      gallery={gallery}
      bookings={bookings}
      contacts={contacts}
      settings={settingsMap}
      heroImages={heroImages}
    />
  )
}