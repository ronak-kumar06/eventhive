export const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop", // Dark abstract green gradient
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop", // Dark elegant concert/event
  "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2070&auto=format&fit=crop", // Minimalist dark leaves
  "https://images.unsplash.com/photo-1550684376-efcbd6e3f031?q=80&w=2070&auto=format&fit=crop", // Abstract dark waves
  "https://images.unsplash.com/photo-1448375240586-882707db8855?q=80&w=2070&auto=format&fit=crop", // Deep green forest aerial
]

export function getDefaultCover(eventId: string): string {
  if (!eventId) return DEFAULT_COVERS[0]
  // Generate a deterministic index between 0 and 4 based on the event ID
  let hash = 0
  for (let i = 0; i < eventId.length; i++) {
    hash = eventId.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % DEFAULT_COVERS.length
  return DEFAULT_COVERS[index]
}
