import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'
import 'dotenv/config'

const prisma = new PrismaClient()

async function main() {
  const password = await hash('password123', 12)

  const users = [
    {
      email: 'admin@eventhive.com',
      name: 'Admin User',
      password,
      role: 'ADMIN' as const,
    },
    {
      email: 'photo@eventhive.com',
      name: 'Photographer User',
      password,
      role: 'PHOTOGRAPHER' as const,
    },
    {
      email: 'member@eventhive.com',
      name: 'Member User',
      password,
      role: 'MEMBER' as const,
    }
  ]

  console.log('Seeding database with test credentials...')
  
  for (const user of users) {
    const existingUser = await prisma.user.findUnique({
      where: { email: user.email }
    })
    
    if (!existingUser) {
      await prisma.user.create({ data: user })
      console.log(`Created user: ${user.email}`)
    } else {
      console.log(`User already exists: ${user.email}`)
    }
  }

  // Add dummy events
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@eventhive.com' } })
  const photographerUser = await prisma.user.findUnique({ where: { email: 'photo@eventhive.com' } })

  if (adminUser && photographerUser) {
    console.log('Clearing old dummy data...')
    await prisma.media.deleteMany({})
    await prisma.event.deleteMany({})
    
    console.log('Seeding dummy events and media...')
    const event1 = await prisma.event.create({
      data: {
        name: 'Spring Music Festival 2026',
        description: 'Annual college music festival featuring local bands and artists.',
        date: new Date('2026-04-15T18:00:00Z'),
        category: 'Music',
        location: 'Campus Main Lawn',
        isPublic: true,
        coverImage: `https://picsum.photos/seed/SpringMusicFestival2026/1200/600`,
        creatorId: adminUser.id,
      }
    })

    const event2 = await prisma.event.create({
      data: {
        name: 'Tech Startup Pitch Night',
        description: 'Students pitch their startup ideas to a panel of alumni investors.',
        date: new Date('2026-05-20T19:30:00Z'),
        category: 'Technology',
        location: 'Innovation Hub',
        isPublic: true,
        coverImage: `https://picsum.photos/seed/TechStartupPitchNight/1200/600`,
        creatorId: adminUser.id,
      }
    })

    // Reliable Picsum image URLs with specific IDs
    const dummyImages = [
      'https://picsum.photos/id/10/800/600',
      'https://picsum.photos/id/11/800/1000',
      'https://picsum.photos/id/12/800/800',
      'https://picsum.photos/id/13/800/1200',
      'https://picsum.photos/id/14/800/600',
      'https://picsum.photos/id/15/800/800',
      'https://picsum.photos/id/16/800/900',
      'https://picsum.photos/id/17/800/700',
      'https://picsum.photos/id/18/800/1100',
      'https://picsum.photos/id/19/800/600'
    ]

    for (let i = 0; i < dummyImages.length; i++) {
      const tags = i % 2 === 0 ? ['music', 'festival', 'crowd'] : ['tech', 'pitch', 'students'];
      
      await prisma.media.create({
        data: {
          url: dummyImages[i],
          type: 'IMAGE',
          eventId: i % 2 === 0 ? event1.id : event2.id,
          uploaderId: photographerUser.id,
          tags: {
            connectOrCreate: tags.map(tag => ({
              where: { name: tag },
              create: { name: tag }
            }))
          }
        }
      })
    }
    console.log('Dummy events and media seeded!')
  }
  
  console.log('Seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
