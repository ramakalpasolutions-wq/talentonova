// src/app/gallery/page.js
import { prisma } from '@/lib/prisma'
import GalleryClient from '@/components/GalleryClient'

export const metadata = {
  title: 'Gallery | Talento Nova',
  description: 'Real moments from our students journeys abroad',
}

export default async function GalleryPage() {
  const gallery = await prisma.gallery.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return <GalleryClient gallery={gallery} />
}