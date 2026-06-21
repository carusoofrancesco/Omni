import { NextRequest, NextResponse } from "next/server"
import { getPlacesData } from "@/app/lib/google-places"
import { analyzeReviews, inferBusinessType } from "@/app/lib/ai-analysis"
import { getReviews } from "@/app/lib/serpapi"
import { analyzeDiscoverability } from "@/app/lib/discoverability"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { businessName, city } = body

    console.log("ENV CHECK:", process.env.GOOGLE_API_KEY ? "chiave trovata" : "chiave NON trovata")

    if (!businessName || !city) {
      return NextResponse.json(
        { error: "Nome attività e città sono obbligatori" },
        { status: 400 }
      )
    }

    // 1 — Dati Google Places
    const placesData = await getPlacesData(businessName, city)

    if (!placesData) {
      return NextResponse.json(
        { error: "Attività non trovata su Google. Prova a essere più specifico." },
        { status: 404 }
      )
    }

    // 2 — Recensioni da SerpApi
    const reviews = await getReviews(placesData.placeId)
    console.log("Recensioni da SerpApi:", reviews.length)

    // 3 — Analisi AI delle recensioni
    const aiAnalysis = await analyzeReviews(businessName, reviews)
    console.log("AI Analysis:", aiAnalysis)

    // 4 — Tipo di attività
    const businessType = await inferBusinessType(placesData.name, placesData.types)
    console.log("Tipo attività:", businessType)

    // 5 — Discoverability
    const discoverability = await analyzeDiscoverability(businessName, city, businessType)
    console.log("Discoverability:", discoverability)

    // 6 — Calcolo punteggi
    const reputationScore = calculateReputationScore(
      placesData.rating,
      placesData.totalReviews,
      aiAnalysis?.sentimentScore ?? null
    )
    const visibilityScore = calculateVisibilityScore(placesData, discoverability.score)
    const socialScore = 50

    // Omni Score = media pesata
    const omniScore = Math.round(
      reputationScore * 0.4 +
      visibilityScore * 0.35 +
      socialScore * 0.25
    )

    return NextResponse.json({
      businessName: placesData.name,
      city,
      omniScore,
      reputation: {
        score: reputationScore,
        rating: placesData.rating,
        totalReviews: placesData.totalReviews,
      },
      visibility: {
        score: visibilityScore,
        foundOnGoogle: true,
        hasWebsite: isRealWebsite(placesData.website),
        websiteUrl: isRealWebsite(placesData.website) ? placesData.website : null,
        discoverability: {
          score: discoverability.score,
          keywords: discoverability.keywords,
        },
      },
      social: {
        score: socialScore,
        hasInstagram: false,
        hasFacebook: false,
      },
      analysis: aiAnalysis
        ? {
            strengths: aiAnalysis.strengths,
            weaknesses: aiAnalysis.weaknesses,
            summary: aiAnalysis.summary,
            sentimentScore: aiAnalysis.sentimentScore,
          }
        : null,
      details: {
        address: placesData.address,
        phone: placesData.phoneNumber,
        website: placesData.website,
        googleMapsUrl: placesData.googleMapsUrl,
        isOpen: placesData.isOpen,
      },
      actionPlan: generateActionPlan(placesData, aiAnalysis, discoverability),
    })
  } catch (error) {
    console.error("Errore analyze:", error)
    return NextResponse.json(
      { error: "Errore interno del server" },
      { status: 500 }
    )
  }
}

// --- Funzioni di supporto ---

function isRealWebsite(url: string | null): boolean {
  if (!url) return false
  const notRealWebsites = ["facebook.com", "instagram.com", "tripadvisor", "google.com"]
  return !notRealWebsites.some((fake) => url.includes(fake))
}

function calculateReputationScore(
  rating: number,
  totalReviews: number,
  sentimentScore: number | null
): number {
  if (rating === 0) return 0
  const ratingScore = (rating / 5) * 60
  const reviewScore = Math.min((totalReviews / 100) * 20, 20)
  const sentiment = sentimentScore ?? 50
  const sentimentContribution = (sentiment / 100) * 20
  return Math.round(ratingScore + reviewScore + sentimentContribution)
}

function calculateVisibilityScore(placesData: any, discoverabilityScore: number): number {
  let score = 0
  if (isRealWebsite(placesData.website)) score += 30
  if (placesData.phoneNumber) score += 20
  if (placesData.isOpen !== null) score += 15
  score += Math.round(discoverabilityScore * 0.35)
  return Math.min(score, 100)
}

function generateActionPlan(placesData: any, aiAnalysis: any, discoverability: any) {
  const actions: { priority: number; action: string; impact: string }[] = []

  const poorKeywords = discoverability.keywords.filter((k: any) => k.score === 0)
  if (poorKeywords.length > 2) {
    actions.push({
      priority: actions.length + 1,
      action: `Non appari per ${poorKeywords.length} ricerche su ${discoverability.keywords.length} — ottimizza la scheda Google Business con parole chiave rilevanti`,
      impact: "Alto",
    })
  }

  if (placesData.totalReviews < 200) {
    actions.push({
      priority: actions.length + 1,
      action: `Hai ${placesData.totalReviews} recensioni — aumentarle migliora il posizionamento su Google Maps`,
      impact: "Alto",
    })
  }

  if (placesData.rating < 4.5) {
    actions.push({
      priority: actions.length + 1,
      action: `Il tuo rating è ${placesData.rating}/5 — rispondere a tutte le recensioni può migliorarlo`,
      impact: "Alto",
    })
  }

  if (!isRealWebsite(placesData.website)) {
    actions.push({
      priority: actions.length + 1,
      action: placesData.website?.includes("facebook.com")
        ? "Hai solo una pagina Facebook come sito — crea un sito web professionale"
        : "Crea un sito web — le attività con sito ricevono il 35% di contatti in più",
      impact: "Alto",
    })
  }

  if (aiAnalysis?.weaknesses && aiAnalysis.weaknesses.length > 0) {
    actions.push({
      priority: actions.length + 1,
      action: `Lavora su: ${aiAnalysis.weaknesses[0].toLowerCase()}`,
      impact: "Medio",
    })
  }

  actions.push({
    priority: actions.length + 1,
    action: "Rispondi alle recensioni recenti — aumenta la fiducia dei nuovi clienti",
    impact: "Medio",
  })

  return actions.slice(0, 3)
}