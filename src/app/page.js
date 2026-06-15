// src/app/page.js
import { prisma } from '@/lib/prisma'
import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import ServicesPreview from '@/components/home/ServicesPreview'
import GalleryPreview from '@/components/home/GalleryPreview'
// import Testimonials from '@/components/home/Testimonials'
import CTASection from '@/components/home/CTASection'

export default async function Home() {
  const [services, gallery, settings, heroImagesData] = await Promise.all([
    prisma.service.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.gallery.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.siteSettings.findMany(),
    prisma.heroImage.findMany({
      orderBy: { createdAt: 'asc' },
    }),
  ])

  // Convert settings to object
  const settingsMap = {}
  settings.forEach((s) => {
    settingsMap[s.key] = s.value
  })

  // Extract image URLs only
  const heroImages = heroImagesData.map((img) => img.imageUrl)

  return (
    <main>
      <HeroSection heroImages={heroImages} />
      <StatsSection />
      <ServicesPreview services={services} />
      <GalleryPreview gallery={gallery} />
      {/* <Testimonials /> */}
      <CTASection />
    </main>
  )
}