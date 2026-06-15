// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
})

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

async function main() {
  console.log('🌱 Starting safe seed...')
  console.log('   (existing data will NOT be deleted)')
  console.log('')

  const adminHash = await hashPassword('admin123')
  const userHash = await hashPassword('user123')

  // ✅ Use upsert - creates if missing, updates if exists
  // ✅ Does NOT delete any other data
  const admin = await prisma.user.upsert({
    where: { email: 'admin@consultancy.com' },
    update: {
      password: adminHash,
      role: 'admin',
      name: 'Admin',
    },
    create: {
      name: 'Admin',
      email: 'admin@consultancy.com',
      password: adminHash,
      role: 'admin',
    },
  })

  const user = await prisma.user.upsert({
    where: { email: 'user@consultancy.com' },
    update: {
      password: userHash,
      role: 'user',
      name: 'Test User',
    },
    create: {
      name: 'Test User',
      email: 'user@consultancy.com',
      password: userHash,
      role: 'user',
    },
  })

  // Show stats
  const stats = {
    users: await prisma.user.count(),
    services: await prisma.service.count(),
    gallery: await prisma.gallery.count(),
    bookings: await prisma.booking.count(),
    contacts: await prisma.contact.count(),
    settings: await prisma.siteSettings.count(),
  }

  console.log('✅ Login users ready:')
  console.log(`   Admin: ${admin.email}`)
  console.log(`   User:  ${user.email}`)
  console.log('')
  console.log('📊 Database Stats:')
  console.log(`   👥 Users    : ${stats.users}`)
  console.log(`   📦 Services : ${stats.services}`)
  console.log(`   🖼️  Gallery  : ${stats.gallery}`)
  console.log(`   📅 Bookings : ${stats.bookings}`)
  console.log(`   💬 Messages : ${stats.contacts}`)
  console.log(`   ⚙️  Settings : ${stats.settings}`)
  console.log('')
  console.log('🎉 Seed completed successfully!')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📧 Admin : admin@consultancy.com / admin123')
  console.log('📧 User  : user@consultancy.com  / user123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })