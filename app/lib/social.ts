export type SocialResult = {
  score: number
  instagram: { found: boolean; url: string | null; verified: boolean }
  facebook: { found: boolean; url: string | null }
  tiktok: { found: boolean; url: string | null }
  tripadvisor: { found: boolean; url: string | null; rating: number | null; reviews: number | null }
  nameConsistency: boolean
}

export async function analyzeSocial(
  businessName: string,
  city: string
): Promise<SocialResult> {
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    console.error("SERPAPI_KEY non configurata")
    return emptyResult()
  }

  try {
    const [instagram, facebook, tiktok, tripadvisor] = await Promise.all([
      searchSocial(businessName, city, apiKey, "instagram", "instagram.com"),
      searchSocial(businessName, city, apiKey, "facebook", "facebook.com"),
      searchSocial(businessName, city, apiKey, "tiktok", "tiktok.com"),
      searchTripAdvisor(businessName, city, apiKey),
    ])

    const nameConsistency = checkNameConsistency(businessName, [
      instagram.title,
      facebook.title,
      tiktok.title,
    ])

    let score = 0
    if (instagram.found) score += 25
    if (facebook.found) score += 15
    if (tiktok.found) score += 25
    if (tripadvisor.found) {
      score += 15
      if (tripadvisor.rating && tripadvisor.rating >= 4) score += 10
    }
    if (nameConsistency) score += 10

    console.log("Social score:", score, { instagram: instagram.found, facebook: facebook.found, tiktok: tiktok.found, tripadvisor: tripadvisor.found })

    return {
      score: Math.min(score, 100),
      instagram: { found: instagram.found, url: instagram.url, verified: instagram.verified ?? false },
      facebook: { found: facebook.found, url: facebook.url },
      tiktok: { found: tiktok.found, url: tiktok.url },
      tripadvisor: { found: tripadvisor.found, url: tripadvisor.url, rating: tripadvisor.rating, reviews: tripadvisor.reviews },
      nameConsistency,
    }
  } catch (error) {
    console.error("Errore social analysis:", error)
    return emptyResult()
  }
}

function emptyResult(): SocialResult {
  return {
    score: 0,
    instagram: { found: false, url: null, verified: false },
    facebook: { found: false, url: null },
    tiktok: { found: false, url: null },
    tripadvisor: { found: false, url: null, rating: null, reviews: null },
    nameConsistency: false,
  }
}

function checkNameConsistency(businessName: string, titles: (string | null)[]): boolean {
  const normalizedBusiness = businessName.toLowerCase().replace(/[^a-z0-9]/g, "")
  const foundTitles = titles.filter(Boolean) as string[]
  if (foundTitles.length === 0) return false
  const matches = foundTitles.filter((title) => {
    const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, "")
    return normalized.includes(normalizedBusiness) || normalizedBusiness.includes(normalized.slice(0, 6))
  })
  return matches.length > 0
}

function findInResults(data: any, domain: string): any {
  // Cerca nei risultati organici
  if (data.organic_results) {
    const found = data.organic_results.find((r: any) => r.link?.includes(domain))
    if (found) return found
  }

  // Cerca nel knowledge graph (social links)
  if (data.knowledge_graph?.profiles) {
    const profile = data.knowledge_graph.profiles.find((p: any) => p.link?.includes(domain))
    if (profile) return { link: profile.link, title: profile.name || "" }
  }

  // Cerca nei social links del knowledge graph
  if (data.knowledge_graph?.social_links) {
    const link = data.knowledge_graph.social_links.find((l: any) => l.link?.includes(domain))
    if (link) return { link: link.link, title: "" }
  }

  return null
}

async function searchSocial(
  businessName: string,
  city: string,
  apiKey: string,
  platform: string,
  domain: string
): Promise<{ found: boolean; url: string | null; title: string | null; verified?: boolean }> {
  try {
    // Prima ricerca: nome + città + piattaforma
    const query = `${businessName} ${city} ${platform}`
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&hl=it&gl=it&api_key=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    console.log(`${platform} primi 3 link:`, data?.organic_results?.slice(0,3).map((r: any) => r.link))

    let result = findInResults(data, domain)

    // Fallback: ricerca più semplice senza città
    if (!result) {
      const query2 = `${businessName} ${platform}`
      const url2 = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query2)}&hl=it&gl=it&api_key=${apiKey}`
      const response2 = await fetch(url2)
      const data2 = await response2.json()
      console.log(`${platform} fallback search:`, data2?.organic_results?.length ?? 0, "risultati")
      result = findInResults(data2, domain)
    }

    if (!result) return { found: false, url: null, title: null }

    const verified = result.title?.includes("•") || false
    return { found: true, url: result.link, title: result.title, verified }
  } catch {
    return { found: false, url: null, title: null }
  }
}

async function searchTripAdvisor(businessName: string, city: string, apiKey: string) {
  try {
    const query = `${businessName} ${city} tripadvisor`
    const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(query)}&hl=it&gl=it&api_key=${apiKey}`
    const response = await fetch(url)
    const data = await response.json()

    console.log("TripAdvisor search:", data?.organic_results?.length ?? 0, "risultati")

    const result = findInResults(data, "tripadvisor")
    if (!result) return { found: false, url: null, title: null, rating: null, reviews: null }

    let rating: number | null = null
    let reviews: number | null = null

    if (result.snippet) {
      const ratingMatch = result.snippet.match(/(\d+[.,]\d+)\s*(?:su|\/)\s*5/)
      if (ratingMatch) rating = parseFloat(ratingMatch[1].replace(",", "."))
      const reviewsMatch = result.snippet.match(/(\d+(?:\.\d+)?)\s*(?:recensioni|reviews)/)
      if (reviewsMatch) reviews = parseInt(reviewsMatch[1].replace(".", ""))
    }

    return { found: true, url: result.link, title: result.title, rating, reviews }
  } catch {
    return { found: false, url: null, title: null, rating: null, reviews: null }
  }
}