"use server"

import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function registerUser(name: string, email: string, password: string) {
  try {
    if (!name || !email || !password) {
      return { error: "Missing required fields" }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return { error: "User already exists" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // The first user could be an ADMIN, but by default we use VIEWER as per schema
        // We'll let them be ADMIN if it's the very first user in the DB for easier testing
      }
    })

    return { success: true }
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Failed to register user" }
  }
}
