export type PlacesResult = {
  placeId: string
  name: string
  rating: number
  totalReviews: number
  address: string
  phoneNumber: string | null
  website: string | null
  isOpen: boolean | null
  googleMapsUrl: string
  reviews: {
    author: string
    rating: number
    text: string
    time: string
  }[]
}

export async function getPlacesData(
  businessName: string,
  city: string
): Promise<PlacesResult | null> {
  const apiKey = process.env.GOOGLE_API_KEY

  if (!apiKey) {
    throw new Error("GOOGLE_API_KEY non configurata")
  }

  try {
    const searchResponse = await fetch(
      "https://places.googleapis.com/v1/places:searchText",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress",
        },
        body: JSON.stringify({
          textQuery: `${businessName} ${city}`,
          languageCode: "it",
        }),
      }
    )

    const searchData = await searchResponse.json()
    console.log("Google Places risposta:", JSON.stringify(searchData, null, 2))

    if (!searchData.places || searchData.places.length === 0) {
      return null
    }

    const place = searchData.places[0]
    const placeId = place.id

    const detailsResponse = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,formattedAddress,nationalPhoneNumber,websiteUri,regularOpeningHours,googleMapsUri,reviews.rating,reviews.text,reviews.authorAttribution,reviews.relativePublishTimeDescription",
        },
      }
    )

    const details = await detailsResponse.json()
    console.log("Google Places dettagli:", JSON.stringify(details, null, 2))

    return {
      placeId,
      name: details.displayName?.text || businessName,
      rating: details.rating || 0,
      totalReviews: details.userRatingCount || 0,
      address: details.formattedAddress || "",
      phoneNumber: details.nationalPhoneNumber || null,
      website: details.websiteUri || null,
      isOpen: details.regularOpeningHours?.openNow ?? null,
      googleMapsUrl: details.googleMapsUri || "",
      reviews: (details.reviews || []).map((r: any) => ({
        author: r.authorAttribution?.displayName || "Anonimo",
        rating: r.rating,
        text: r.text?.text || "",
        time: r.relativePublishTimeDescription || "",
      })),
    }
  } catch (error) {
    console.error("Errore Google Places API:", error)
    return null
  }
}