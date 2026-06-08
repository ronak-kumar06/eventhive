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

// AWS S3 Provider stub for later
export class S3StorageProvider implements StorageProvider {
  async uploadFile(file: File | Blob, originalName: string, folder: string): Promise<string> {
    throw new Error("S3 Upload not implemented yet")
  }
  
  async deleteFile(url: string): Promise<void> {
    throw new Error("S3 Delete not implemented yet")
  }
}

// Factory to get the current provider
export function getStorageProvider(): StorageProvider {
  // We can use env vars later to switch to S3
  const useS3 = process.env.USE_S3 === "true"
  return useS3 ? new S3StorageProvider() : new LocalStorageProvider()
}
