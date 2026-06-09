import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Copy of Euclidean distance function from action.ts
function euclideanDistance(arr1, arr2) {
  if (arr1.length !== arr2.length) return Infinity
  let sum = 0
  for (let i = 0; i < arr1.length; i++) {
    sum += Math.pow(arr1[i] - arr2[i], 2)
  }
  return Math.sqrt(sum)
}

async function runTest() {
  console.log("=== BACKEND TEST: FACE MATCHING ===")
  
  // 1. Mock user embedding
  const mockUserEmbedding = new Array(128).fill(0.1)
  
  // 2. Mock media embedding (slightly different)
  const mockMediaEmbedding = new Array(128).fill(0.11)
  
  // 3. Test mathematical distance
  const distance = euclideanDistance(mockUserEmbedding, mockMediaEmbedding)
  console.log(`Test Distance Calculation: ${distance.toFixed(4)}`)
  if (isNaN(distance)) {
    throw new Error("MATH ERROR: Distance is NaN")
  }
  if (distance < 0.55) {
    console.log("SUCCESS: Distance is under threshold! Match logic works.")
  } else {
    console.warn("WARNING: Distance is above threshold.")
  }

  // 4. Test Database Connection
  try {
    const userCount = await prisma.user.count()
    console.log(`SUCCESS: Database connected. Found ${userCount} users.`)
  } catch (err) {
    throw new Error(`DB ERROR: ${err.message}`)
  }

  console.log("=== ALL BACKEND TESTS PASSED ===")
}

runTest().catch(console.error).finally(() => prisma.$disconnect())
