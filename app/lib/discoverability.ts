import { generateKeywords } from "./ai-analysis"

export type KeywordResult = {
  keyword: string
  position: number | null
  inLocalPack: boolean
  localPackPosition: number | null
  score: number
}

export type DiscoverabilityResult = {
  score: number
  keywords: KeywordResult[]
}

function calculateScore(inLocalPack: boolean, localPackPosition: number | null, position: number | null): number {
  if (inLocalPack && localPackPosition !== null) {
    if (localPackPosition === 1) return 100
    if (localPackPosition === 2) return 85
    return 70
  }
  if (position !== null) {
    if (position <= 3) return 60
    if (position <= 10) return 40
    return 20
  }
  return 0
}

export async function analyzeDiscoverability(
  businessName: string,
  city: string,
  businessType: string
): Promise<DiscoverabilityResult> {
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    console.error("SERPAPI_KEY non configurata")
    return { score: 0, keywords: [] }
  }

  const keywords = await generateKeywords(businessName, city, businessType)
  const results: KeywordResult[] = []

  for (const keyword of keywords) {
    try {
      const locationQuery = `${city}, Italy`
      const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(keyword)}&location=${encodeURIComponent(locationQuery)}&hl=it&gl=it&api_key=${apiKey}`
      const response = await fetch(url)
      const data = await response.json()

      console.log(`SerpApi keyword "${keyword}": ${data?.search_metadata?.status}`)

      let position: number | null = null
      let inLocalPack = false
      let localPackPosition: number | null = null

      if (data.local_results) {
        const localIndex = data.local_results.findIndex((r: any) =>
          r.title?.toLowerCase().includes(businessName.toLowerCase())
        )
        if (localIndex !== -1) {
          inLocalPack = true
          localPackPosition = localIndex + 1
        }
      }

      if (!inLocalPack && data.organic_results) {
        const organicIndex = data.organic_results.findIndex((r: any) =>
          r.title?.toLowerCase().includes(businessName.toLowerCase()) ||
          r.snippet?.toLowerCase().includes(businessName.toLowerCase())
        )
        if (organicIndex !== -1) {
          position = organicIndex + 1
        }
      }

      const score = calculateScore(inLocalPack, localPackPosition, position)
      results.push({ keyword, position, inLocalPack, localPackPosition, score })

      await new Promise((r) => setTimeout(r, 300))
    } catch (error) {
      console.error(`Errore keyword "${keyword}":`, error)
      results.push({ keyword, position: null, inLocalPack: false, localPackPosition: null, score: 0 })
    }
  }

  const avgScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0

  console.log("Discoverability score finale:", avgScore)
  return { score: avgScore, keywords: results }
}