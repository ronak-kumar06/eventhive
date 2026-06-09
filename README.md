# EventHive 📸

EventHive is a modern event photography sharing platform with built-in **Client-Side AI Facial Recognition**. Find your photos across thousands of event galleries instantly without sacrificing privacy!

## Features 🚀
- **100% Client-Side AI**: Facial recognition runs completely in your browser using `@vladmandic/face-api`. No Docker, no Python, no backend GPU required!
- **Privacy First**: Your selfie never leaves your device. Only the mathematical face embeddings are processed.
- **Dynamic Events**: Create public or private events with random local cover photos.
- **Robust Gallery**: Like, comment, favorite, and manage your event photos.
- **Secure Authentication**: NextAuth integration for safe logins.

## Tech Stack 💻
- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS, Framer Motion
- **Database**: PostgreSQL with Prisma ORM
- **AI Engine**: TensorFlow.js (face-api)

## Getting Started 🛠️

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up your `.env` with your `DATABASE_URL` and `AUTH_SECRET`
4. Push the database schema:
```bash
npx prisma db push
```
5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app!

## Test Credentials 🔑
Use the following pre-seeded dummy accounts to test role-based permissions:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@eventhive.com` | `password123` | Full access, can delete events/photos, download all. |
| **Photographer** | `photo@eventhive.com` | `password123` | Can upload photos, download photos. |
| **Club Member** | `member@eventhive.com` | `password123` | Can view and download photos. |
| **Viewer** | `viewer@eventhive.com` | `password123` | Can view photos. Cannot download. |
