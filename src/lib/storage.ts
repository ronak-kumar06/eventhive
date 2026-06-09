import { writeFile } from "fs/promises"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Abstract Storage Provider Interface
export interface StorageProvider {
  uploadFile(file: File | Blob, originalName: string, folder: string): Promise<string>
  deleteFile(url: string): Promise<void>
}

// Local Storage Provider Implementation
export class LocalStorageProvider implements StorageProvider {
  private baseDir = path.join(process.cwd(), "public", "uploads")

  async uploadFile(file: File | Blob, originalName: string, folder: string): Promise<string> {
    // If running on Vercel, the filesystem is read-only. We fallback to Base64 Data URIs.
    if (process.env.VERCEL === "1" || process.env.NEXT_PUBLIC_VERCEL_ENV) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      const base64 = buffer.toString("base64")
      return `data:${file.type};base64,${base64}`
    }

    const ext = path.extname(originalName) || ""
    const fileName = `${uuidv4()}${ext}`
    const uploadDir = path.join(this.baseDir, folder)
    const filePath = path.join(uploadDir, fileName)

    // Ensure directory exists
    const fs = await import("fs")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    await writeFile(filePath, buffer)

    return `/uploads/${folder}/${fileName}`
  }

  async deleteFile(url: string): Promise<void> {
    const relativePath = url.replace(/^\//, "")
    const fullPath = path.join(process.cwd(), "public", relativePath)
    
    try {
      const fs = await import("fs")
      if (fs.existsSync(fullPath)) {
        await fs.promises.unlink(fullPath)
      }
    } catch (error) {
      console.error("Failed to delete file:", error)
    }
  }
}

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

// AWS S3 Provider stub for later
export class S3StorageProvider implements StorageProvider {
  private s3: S3Client
  private bucket: string

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION || "us-east-1",
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
      }
    })
    this.bucket = process.env.AWS_S3_BUCKET || ""
  }

  async uploadFile(file: File | Blob, originalName: string, folder: string): Promise<string> {
    if (!this.bucket) throw new Error("AWS_S3_BUCKET is not set")
    
    const ext = path.extname(originalName) || ""
    const fileName = `${folder}/${uuidv4()}${ext}`
    
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await this.s3.send(new PutObjectCommand({
      Bucket: this.bucket,
      Key: fileName,
      Body: buffer,
      ContentType: file.type
    }))

    return `https://${this.bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`
  }
  
  async deleteFile(url: string): Promise<void> {
    if (!this.bucket) throw new Error("AWS_S3_BUCKET is not set")
    
    const key = url.split(".amazonaws.com/")[1]
    if (!key) return

    await this.s3.send(new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: key
    }))
  }
}

// Factory to get the current provider
export function getStorageProvider(): StorageProvider {
  // We can use env vars later to switch to S3
  const useS3 = process.env.USE_S3 === "true"
  return useS3 ? new S3StorageProvider() : new LocalStorageProvider()
}
