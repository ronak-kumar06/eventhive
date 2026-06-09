import { redirect, notFound } from "next/navigation"
import prisma from "@/lib/prisma"
import { auth } from "@/auth"
import { EditEventClient } from "./EditEventClient"

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const session = await auth()
  
  if (!session?.user?.id) {
    redirect("/login")
  }

  const event = await prisma.event.findUnique({
    where: { id: resolvedParams.id },
  })

  if (!event) {
    notFound()
  }

  if (session.user.role !== "ADMIN" && event.creatorId !== session.user.id) {
    redirect(`/events/${resolvedParams.id}`)
  }

  return <EditEventClient event={event} />
}
