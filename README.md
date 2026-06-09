<div align="center">

# 📸 EventHive

**"Capture. Organize. Relive."**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![AWS S3](https://img.shields.io/badge/AWS_S3-569A31?style=for-the-badge&logo=amazon-s3&logoColor=white)](https://aws.amazon.com/s3/)

![EventHive Banner](https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?q=80&w=1200&auto=format&fit=crop)

</div>

---

## 📑 Table of Contents
- [Problem Statement](#-problem-statement)
- [Features](#-features)
- [System Architecture](#%EF%B8%8F-system-architecture)
- [Tech Stack](#-tech-stack)
- [Database Design](#-database-design)
- [Folder Structure](#-folder-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Screenshots](#-screenshots-section)
- [Future Enhancements](#-future-enhancements)
- [Contributing](#-contributing)
- [License](#-license)
- [Acknowledgements](#-acknowledgements)

---

## 🎯 Problem Statement

Event photographers, clubs, and societies often capture thousands of photos during an event. Distributing these photos is a chaotic process involving scattered Google Drive links, compressed WhatsApp groups, or tedious manual tagging. Guests struggle to find pictures of themselves among thousands of files, and organizers lack a centralized platform with proper access controls.

**EventHive** solves this by providing a unified Event & Media Management Platform. It introduces **Client-Side AI Facial Recognition** to instantly filter galleries for photos containing a specific user's face, ensuring privacy while delivering a seamless, high-end gallery experience.

---

## ✨ Features

### Event Management
* Create and manage events (Public/Private)
* Dynamic event metadata (Location, Dates, Categories)
* High-quality event cover photos

### Media Management
* Photo uploads with AWS S3 cloud integration
* Event-wise gallery views
* High-resolution image streaming

### Authentication & Access Control
* Secure Credentials Authentication (Email/Password)
* Strict Role-Based Access Control (RBAC):
  * **Admin:** Full moderation access
  * **Photographer:** Upload and download permissions
  * **Member:** View and download permissions
  * **Viewer:** View-only access (Downloads restricted)

### Social Features
* Like photos
* Comment on media
* Favorite/Save images
* Real-time notifications (Polling architecture)
* Smart tagging

### Intelligent Features
* **Personalized Photo Discovery:** 100% Client-Side AI facial recognition powered by `@vladmandic/face-api`.
* **Privacy-First Processing:** Biometric data never leaves the browser.
* Smart image tagging for advanced search

---

## 🏗️ System Architecture

EventHive uses a modern Serverless JAMStack architecture, opting for Edge AI over expensive backend AI microservices to ensure user privacy and lower operating costs.

```mermaid
graph TD
  Client[Client Browser / Mobile]
  
  subgraph Frontend [Next.js 15 App Router]
    UI[React Components]
    AI[Face-API.js Models]
    Auth[NextAuth Session]
  end
  
  subgraph Backend [Vercel Serverless API]
    API[Next.js API Routes]
    Prisma[Prisma ORM]
  end
  
  subgraph Storage [Cloud Infrastructure]
    Neon[(Neon PostgreSQL)]
    S3[AWS S3 Bucket]
  end

  Client -->|Interacts| UI
  Client -->|Matches Faces Locally| AI
  UI -->|Validates Session| Auth
  UI -->|Requests/Uploads| API
  API -->|Queries Data| Prisma
  API -->|Streams Media| S3
  Prisma -->|Reads/Writes| Neon
```

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Next.js 15, React, Tailwind CSS, Framer Motion, Shadcn UI |
| **Backend** | Next.js Server Actions & API Routes, Node.js |
| **Database** | PostgreSQL (Neon Tech), Prisma ORM |
| **Authentication** | NextAuth.js (v5) |
| **Cloud Storage** | AWS S3 |
| **AI Services** | `@vladmandic/face-api` (Client-Side Edge AI) |
| **Realtime** | SWR Polling (Serverless-optimized) |
| **Deployment** | Vercel |

---

## 🗄️ Database Design

```mermaid
erDiagram
  USER ||--o{ EVENT : "creates"
  USER ||--o{ MEDIA : "uploads"
  USER ||--o{ COMMENT : "writes"
  USER ||--o{ LIKE : "gives"
  USER ||--o{ FAVORITE : "saves"
  USER ||--o{ NOTIFICATION : "receives"
  
  EVENT ||--o{ ALBUM : "contains"
  EVENT ||--o{ MEDIA : "contains"
  ALBUM ||--o{ MEDIA : "contains"
  
  MEDIA ||--o{ COMMENT : "has"
  MEDIA ||--o{ LIKE : "has"
  MEDIA ||--o{ FAVORITE : "has"
  MEDIA ||--o{ MEDIAFACE : "has"
  MEDIA ||--o{ TAG : "tagged with"
  
  USER {
    String id
    String email
    Role role
    Float[] faceEmbedding
  }
  
  MEDIA {
    String id
    String url
    MediaType type
  }
  
  NOTIFICATION {
    String id
    String message
    Boolean read
  }
```

---

## 📁 Folder Structure

```text
eventhive/web/
├── public/                # Static assets and AI model weights
├── prisma/                # Database schema and seeders
├── src/
│   ├── app/               # Next.js App Router (Pages, Layouts, API Routes)
│   ├── components/        # Reusable UI components (Shadcn, Layouts, Media)
│   ├── lib/               # Utility functions, Prisma client, Notify logic
│   ├── types/             # TypeScript type definitions
│   └── auth.ts            # NextAuth configuration
├── .env                   # Environment variables
├── next.config.ts         # Next.js configuration
├── package.json           # Dependencies and scripts
└── tailwind.config.ts     # Tailwind CSS theme configuration
```

- `app/`: Contains the core routing, API endpoints, and server actions.
- `components/`: Modular React components divided into UI primitives and complex features.
- `lib/`: Shared utilities like the Prisma database instance and notification triggers.
- `prisma/`: Holds `schema.prisma` mapping out the relational database.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- A PostgreSQL Database (Local or Neon)
- AWS Account (for S3 Storage)

### Installation

1. **Clone repository:**
   ```bash
   git clone https://github.com/ronak-kumar06/eventhive.git
   cd eventhive/web
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file based on the provided `.env.example`.

4. **Set up database & run migrations:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory. Below is the `.env.example`:

```env
# Database configuration
DATABASE_URL="postgresql://user:password@host/db"

# NextAuth configuration
AUTH_SECRET="your_secure_random_string"

# AWS S3 Storage configuration
AWS_ACCESS_KEY_ID="your_aws_access_key"
AWS_SECRET_ACCESS_KEY="your_aws_secret_key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET_NAME="your_bucket_name"
```

- **`DATABASE_URL`**: Your PostgreSQL connection string.
- **`AUTH_SECRET`**: A random string used to hash NextAuth tokens securely.
- **`AWS_*`**: Credentials required to upload and proxy media streams from your S3 bucket securely.

---

## 🔌 API Overview

* **Authentication**
  - `POST /api/auth/[...nextauth]` - NextAuth session handling
* **Media**
  - `POST /api/upload` - Securely process and upload media to AWS S3
  - `GET /api/download` - Stream high-res media (RBAC enforced)
* **Social & Notifications**
  - `GET /api/notifications` - Fetch unread real-time notifications
  - `POST /api/notifications` - Mark notifications as read

*(Note: Most heavy lifting is handled natively through Next.js Server Actions rather than traditional REST APIs).*

---

## 🖼️ Screenshots Section

> *(Replace these placeholders with your actual application screenshots)*

* **Landing Page**: `[Placeholder: Beautiful event banner and call-to-action]`
* **Dashboard**: `[Placeholder: Grid of active events]`
* **Event Gallery**: `[Placeholder: Masonry layout of high-quality event photos]`
* **Personalized Gallery**: `[Placeholder: Filtered view showing only photos of the logged-in user]`

---

## 🔮 Future Enhancements

* **Dynamic Watermarking**: Generate real-time club-based watermarks during downloads.
* **Progressive Web App support**: Allow users to install EventHive as a native mobile app.
* **Collaborative albums**: Let multiple photographers contribute to a single event album.
* **QR-based sharing**: Easily share private event links at physical venues.
* **Analytics dashboard**: Show clubs how many times their photos were viewed or downloaded.
* **Duplicate media detection**: Prevent the same photo from being uploaded twice.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgements

Special thanks to the tools and communities that made this possible:
* [Next.js](https://nextjs.org/)
* [Prisma ORM](https://www.prisma.io/)
* [Tailwind CSS](https://tailwindcss.com/)
* [face-api.js](https://github.com/vladmandic/face-api)
* [AWS S3](https://aws.amazon.com/s3/)
