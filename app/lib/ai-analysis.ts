import Anthropic from "@anthropic-ai/sdk"

export type AIAnalysis = {
  strengths: string[]
  weaknesses: string[]
  summary: string
  sentimentScore: number
}

export async function analyzeReviews(
  businessName: string,
  reviews: { author: string; rating: number; text: string; time: string }[]
): Promise<AIAnalysis | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY non configurata")
    return null
  }

  if (reviews.length === 0) {
    return {
      strengths: ["Presenza su Google Maps"],
      weaknesses: ["Nessuna recensione disponibile per l'analisi"],
      summary: "Non ci sono ancora recensioni sufficienti per un'analisi dettagliata.",
      sentimentScore: 50,
    }
  }

  try {
    const client = new Anthropic({ apiKey })

    const reviewsText = reviews
      .map((r) => `- [${r.rating}/5] ${r.text}`)
      .join("\n")

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: `Sei un esperto di marketing locale. Analizza queste recensioni Google di "${businessName}" e rispondi SOLO con un JSON valido, senza testo aggiuntivo, senza backtick, senza markdown.

Recensioni:
${reviewsText}

Rispondi esattamente in questo formato JSON:
{
  "strengths": ["punto di forza 1", "punto di forza 2", "punto di forza 3"],
  "weaknesses": ["criticità 1", "criticità 2"],
  "summary": "Un paragrafo sintetico in italiano che riassume la reputazione dell'attività basandosi sulle recensioni.",
  "sentimentScore": 75
}

Regole:
- strengths: massimo 3 punti di forza concreti emersi dalle recensioni
- weaknesses: massimo 3 criticità concrete emerse dalle recensioni
- summary: massimo 2 frasi in italiano
- sentimentScore: numero da 0 a 100 che rappresenta il sentiment generale`,
        },
      ],
    })

    const rawText = message.content[0].type === "text" ? message.content[0].text.trim() : ""
    const text = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    console.log("Claude risposta:", text)

    const parsed = JSON.parse(text)
    return parsed as AIAnalysis
  } catch (error) {
    console.error("Errore AI analysis:", error)
    return null
  }
}

export async function inferBusinessType(
  businessName: string,
  types: string[]
): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return "attività"

  try {
    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 100,
      messages: [
        {
          role: "user",
          content: `Dato il nome di un'attività e i suoi tipi Google, rispondi SOLO con il tipo di attività in italiano, una o due parole, minuscolo, senza punteggiatura.

Nome: "${businessName}"
Tipi Google: ${types.join(", ")}

Esempi di risposta: pizzeria, bar, paninoteca, palestra, parrucchiere, dentista, ristorante, gelateria, pasticceria, hotel

Rispondi solo con il tipo, nient'altro.`,
        },
      ],
    })

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "attività"
    console.log("Tipo attività inferito:", text)
    return text
  } catch (error) {
    console.error("Errore inferBusinessType:", error)
    return "attività"
  }
}

export async function generateKeywords(
  businessName: string,
  city: string,
  businessType: string
): Promise<string[]> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return [`${businessType} ${city}`]

  try {
    const client = new Anthropic({ apiKey })

    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content: `Sei un cliente che vuole trovare "${businessName}", una ${businessType} a ${city}, ma non ne conosce il nome.

Genera 5 ricerche Google realistiche e diverse tra loro che faresti per trovare questo tipo di attività.
Le ricerche devono essere varie: alcune generiche, alcune specifiche, alcune con intento diverso.
Rispondi SOLO con un JSON array di stringhe, senza testo aggiuntivo, senza backtick.

Esempio formato: ["ricerca 1", "ricerca 2", "ricerca 3", "ricerca 4", "ricerca 5"]`,
        },
      ],
    })

    const text = message.content[0].type === "text" ? message.content[0].text.trim() : "[]"
    const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim()
    const keywords = JSON.parse(cleaned)
    console.log("Keyword generate:", keywords)
    return keywords
  } catch (error) {
    console.error("Errore generateKeywords:", error)
    return [`${businessType} ${city}`, `${businessType} a ${city}`]
  }
}