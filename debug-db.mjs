import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    where: { faceEmbedding: { isEmpty: false } }
  })
  console.log(`Users with face embedding: ${users.length}`)
  if (users.length > 0) {
    console.log(`Sample user embedding length: ${users[0].faceEmbedding.length}`)
  }

  const mediaFaces = await prisma.mediaFace.findMany({
    include: { media: true }
  })
  console.log(`MediaFace records: ${mediaFaces.length}`)
  if (mediaFaces.length > 0) {
    console.log(`Sample MediaFace embedding length: ${mediaFaces[0].embedding.length}`)
    
    // Test match logic against first user
    if (users.length > 0) {
      const uEmb = users[0].faceEmbedding
      const mEmb = mediaFaces[0].embedding
      let sum = 0
      for (let i = 0; i < 128; i++) {
        sum += Math.pow(uEmb[i] - mEmb[i], 2)
      }
      console.log(`Distance between user 0 and media 0: ${Math.sqrt(sum)}`)
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect())
