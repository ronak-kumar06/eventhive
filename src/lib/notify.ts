export async function sendNotification(event: string, payload: any) {
  try {
    const socketServerUrl = process.env.SOCKET_SERVER_URL || "http://localhost:4000"
    await fetch(`${socketServerUrl}/notify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ event, payload }),
    })
  } catch (error) {
    console.error("Failed to send notification to socket server:", error)
  }
}
