export function getDefaultCover(category: string): string {
  const normalizedCategory = (category || "Other").trim()
  
  const categoryMap: Record<string, string> = {
    "Workshop": "/covers/workshop.jpg",
    "Photoshoot": "/covers/Photoshoot.webp",
    "Trip": "/covers/Trip.webp",
    "Competition": "/covers/Competition.webp",
    "Cultural Fest": "/covers/Cultural_fest.webp",
    "Party": "/covers/Party.webp",
    "Other": "/covers/Other.webp"
  }

  // Fallback to Other.webp if the category doesn't strictly match
  return categoryMap[normalizedCategory] || "/covers/Other.webp"
}
