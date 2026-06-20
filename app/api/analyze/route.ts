import { NextRequest, NextResponse } from "next/server"
import { getPlacesData } from "@/app/lib/google-places"

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

    const placesData = await getPlacesData(businessName, city)

    if (!placesData) {
      return NextResponse.json(
        { error: "Attività non trovata su Google. Prova a essere più specifico." },
        { status: 404 }
      )
    }

    // Calcolo punteggi
    const reputationScore = calculateReputationScore(
      placesData.rating,
      placesData.totalReviews
    )
    const visibilityScore = calculateVisibilityScore(placesData)
    const socialScore = 60 // mock per ora, lo faremo dopo

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
      },
      social: {
        score: socialScore,
        hasInstagram: false,
        hasFacebook: false,
      },
      details: {
        address: placesData.address,
        phone: placesData.phoneNumber,
        website: placesData.website,
        googleMapsUrl: placesData.googleMapsUrl,
        isOpen: placesData.isOpen,
      },
      actionPlan: generateActionPlan(placesData),
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

function calculateReputationScore(rating: number, totalReviews: number): number {
  if (rating === 0) return 0
  // Rating vale 70 punti, numero recensioni vale 30
  const ratingScore = (rating / 5) * 70
  const reviewScore = Math.min((totalReviews / 100) * 30, 30)
  return Math.round(ratingScore + reviewScore)
}

function calculateVisibilityScore(placesData: any): number {
  let score = 0

  // Trovata su Google Maps = 40 punti base
  score += 40

  // Ha un sito web reale = 30 punti
  if (isRealWebsite(placesData.website)) score += 30

  // Ha un numero di telefono = 15 punti
  if (placesData.phoneNumber) score += 15

  // Ha gli orari configurati = 15 punti
  if (placesData.isOpen !== null) score += 15

  return Math.min(score, 100)
}

function generateActionPlan(placesData: any) {
  const actions: { priority: number; action: string; impact: string }[] = []

  // Poche recensioni
  if (placesData.totalReviews < 200) {
    actions.push({
      priority: actions.length + 1,
      action: `Hai ${placesData.totalReviews} recensioni — aumentarle migliora il posizionamento su Google Maps`,
      impact: "Alto",
    })
  }

  // Rating migliorabile
  if (placesData.rating < 4.5) {
    actions.push({
      priority: actions.length + 1,
      action: `Il tuo rating è ${placesData.rating}/5 — rispondere a tutte le recensioni (positive e negative) può migliorarlo`,
      impact: "Alto",
    })
  }

  // Nessun sito web reale
  if (!isRealWebsite(placesData.website)) {
    actions.push({
      priority: actions.length + 1,
      action: placesData.website?.includes("facebook.com")
        ? "Hai solo una pagina Facebook come sito — crea un sito web professionale per aumentare la credibilità"
        : "Crea un sito web — le attività con sito ricevono il 35% di contatti in più",
      impact: "Alto",
    })
  }

  // Nessun telefono
  if (!placesData.phoneNumber) {
    actions.push({
      priority: actions.length + 1,
      action: "Aggiungi un numero di telefono alla scheda Google Business",
      impact: "Medio",
    })
  }

  // Orari non configurati
  if (placesData.isOpen === null) {
    actions.push({
      priority: actions.length + 1,
      action: "Configura gli orari di apertura su Google Business — i clienti li cercano spesso",
      impact: "Medio",
    })
  }

  // Consiglio sempre presente
  actions.push({
    priority: actions.length + 1,
    action: "Rispondi alle recensioni recenti — aumenta la fiducia dei nuovi clienti",
    impact: "Medio",
  })

  return actions.slice(0, 3)
}