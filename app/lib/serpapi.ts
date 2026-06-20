export type SerpReview = {
  author: string
  rating: number
  text: string
  time: string
}

export async function getReviews(
  placeId: string,
): Promise<SerpReview[]> {
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    console.error("SERPAPI_KEY non configurata")
    return []
  }

  try {
    const reviewsUrl = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${placeId}&api_key=${apiKey}&hl=it`

    const reviewsResponse = await fetch(reviewsUrl)
    const reviewsData = await reviewsResponse.json()

    console.log("SerpApi status:", reviewsData?.search_metadata?.status)
    console.log("SerpApi recensioni trovate:", reviewsData?.reviews?.length ?? 0)

    if (!reviewsData.reviews || reviewsData.reviews.length === 0) {
      return []
    }

    return reviewsData.reviews.map((r: any) => ({
      author: r.user?.name || "Anonimo",
      rating: r.rating || 0,
      text: r.snippet || "",
      time: r.date || "",
    }))
  } catch (error) {
    console.error("Errore SerpApi:", error)
    return []
  }
}