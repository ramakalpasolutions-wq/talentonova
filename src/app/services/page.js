// src/app/services/page.js
import { prisma } from '@/lib/prisma'
import ServicesClient from '@/components/ServicesClient'

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <ServicesClient services={services} />
}