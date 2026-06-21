"use client"

import { useState } from "react"
import LoadingScreen from "./LoadingScreen"

type AnalysisResult = {
  businessName: string
  city: string
  omniScore: number
  reputation: { score: number; rating: number; totalReviews: number }
  visibility: { score: number; foundOnGoogle: boolean; hasWebsite: boolean; websiteUrl: string | null }
  social: { score: number; hasInstagram: boolean; hasFacebook: boolean }
  analysis: { strengths: string[]; weaknesses: string[]; summary: string; sentimentScore: number } | null
  details: { address: string; phone: string | null; website: string | null; googleMapsUrl: string; isOpen: boolean | null }
  actionPlan: { priority: number; action: string; impact: string }[]
}

const scoreColor = (s: number) => {
  if (s >= 85) return "#4ABA7A"
  if (s >= 76) return "#82C460"
  if (s >= 60) return "#E8A84A"
  if (s >= 50) return "#F0A86A"
  return "#D96B6B"
}

const impactStyle = (impact: string) => impact === "Alto"
  ? { color: "#A32D2D", background: "#FCEBEB" }
  : { color: "#854F0B", background: "#FAEEDA" }

const C = {
  card: "#FFFFFF",
  input: "#F0F0F2",
  inputLanding: "#FAFAFA",
  border: "rgba(0,0,0,0.08)",
  textPrimary: "#1A1A1A",
  textSecondary: "#6E6E73",
  textTertiary: "#AEAEB2",
  purple: "#7F77DD",
  purpleLight: "#AFA9EC",
}

export default function SearchForm() {
  const [businessName, setBusinessName] = useState("")
  const [city, setCity] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!businessName || !city) return
    setIsLoading(true)
    setError("")
    setResult(null)
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ businessName, city }),
      })
      const data = await response.json()
      if (!response.ok) { setError(data.error || "Qualcosa è andato storto"); return }
      setResult(data)
    } catch {
      setError("Errore di connessione. Riprova.")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <LoadingScreen businessName={businessName} city={city} />

  if (result) return (
    <div style={{ maxWidth: "480px", margin: "0 auto", padding: "0 1.5rem 4rem" }}>

      <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "20px", padding: "2rem", textAlign: "center", marginBottom: "1rem" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.8px", color: C.textTertiary, marginBottom: "0.75rem" }}>OMNI SCORE</div>
        <div style={{ fontSize: "96px", fontWeight: 800, letterSpacing: "-6px", color: C.purple, lineHeight: 1 }}>{result.omniScore}</div>
        <div style={{ fontSize: "12px", color: C.textTertiary, marginTop: "0.4rem" }}>su 100</div>
        <div style={{ marginTop: "1.25rem", background: C.input, borderRadius: "99px", height: "2px", overflow: "hidden" }}>
          <div style={{ height: "2px", width: `${result.omniScore}%`, background: `linear-gradient(90deg,${C.purpleLight},${C.purple})`, borderRadius: "99px", transition: "width 1s cubic-bezier(0.16,1,0.3,1)" }} />
        </div>
        <div style={{ fontSize: "13px", color: C.textTertiary, marginTop: "1rem" }}>{result.businessName} · {result.city}</div>
      </div>

      <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "20px", padding: "1.5rem 2rem", marginBottom: "1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", textAlign: "center" as const }}>
          <div style={{ padding: "0.5rem 0", borderRight: `0.5px solid ${C.border}` }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.6px", color: C.textTertiary, marginBottom: "0.5rem" }}>REPUTAZIONE</div>
            <div style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-3px", color: scoreColor(result.reputation.score), lineHeight: 1 }}>{result.reputation.score}</div>
            <div style={{ fontSize: "10px", color: C.textTertiary, marginTop: "0.5rem" }}>{result.reputation.rating} · {result.reputation.totalReviews} rec.</div>
          </div>
          <div style={{ padding: "0.5rem 0", borderRight: `0.5px solid ${C.border}` }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.6px", color: C.textTertiary, marginBottom: "0.5rem" }}>VISIBILITÀ</div>
            <div style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-3px", color: scoreColor(result.visibility.score), lineHeight: 1 }}>{result.visibility.score}</div>
            <div style={{ fontSize: "10px", color: C.textTertiary, marginTop: "0.5rem" }}>{result.visibility.hasWebsite ? "Sito web" : "Nessun sito"}</div>
          </div>
          <div style={{ padding: "0.5rem 0" }}>
            <div style={{ fontSize: "10px", letterSpacing: "0.6px", color: C.textTertiary, marginBottom: "0.5rem" }}>SOCIAL</div>
            <div style={{ fontSize: "52px", fontWeight: 800, letterSpacing: "-3px", color: scoreColor(result.social.score), lineHeight: 1 }}>{result.social.score}</div>
            <div style={{ fontSize: "10px", color: C.textTertiary, marginTop: "0.5rem" }}>Non analizzato</div>
          </div>
        </div>
      </div>

      <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "20px", padding: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.5px", color: C.textTertiary, marginBottom: "1rem" }}>DETTAGLI</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {result.details.address && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: C.textSecondary }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
              {result.details.address}
            </div>
          )}
          {result.details.phone && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: C.textSecondary }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 8.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
              {result.details.phone}
            </div>
          )}
          {result.details.isOpen !== null && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" stroke={result.details.isOpen ? "#16A34A" : "#C0392B"} />
                <polyline points="12 6 12 12 16 14" stroke={result.details.isOpen ? "#16A34A" : "#C0392B"} />
              </svg>
              <span style={{ color: result.details.isOpen ? "#16A34A" : "#C0392B", fontWeight: 500 }}>
                {result.details.isOpen ? "Aperto ora" : "Chiuso ora"}
              </span>
            </div>
          )}
          {result.details.googleMapsUrl && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#AEAEB2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
              <span style={{ color: C.purple, fontWeight: 500, cursor: "pointer" }} onClick={() => window.open(result.details.googleMapsUrl, "_blank")}>
                Vedi su Google Maps
              </span>
            </div>
          )}
        </div>
      </div>

      {result.analysis && (
        <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "20px", padding: "1.5rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.5px", color: C.textTertiary, marginBottom: "0.75rem" }}>ANALISI AI</div>
          <p style={{ fontSize: "13px", color: C.textSecondary, lineHeight: 1.6, marginBottom: "1.25rem", fontStyle: "italic" }}>
            {result.analysis.summary}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.4px", color: "#0F6E56", marginBottom: "0.6rem" }}>PUNTI DI FORZA</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {result.analysis.strengths.map((s, i) => (
                  <div key={i} style={{ fontSize: "12px", color: C.textSecondary, background: "#E1F5EE", borderRadius: "10px", padding: "8px 10px" }}>{s}</div>
                ))}
              </div>
            </div>
            <div>
              <div style={{ fontSize: "11px", letterSpacing: "0.4px", color: "#A32D2D", marginBottom: "0.6rem" }}>CRITICITÀ</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {result.analysis.weaknesses.map((w, i) => (
                  <div key={i} style={{ fontSize: "12px", color: C.textSecondary, background: "#FCEBEB", borderRadius: "10px", padding: "8px 10px" }}>{w}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={{ background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "20px", padding: "1.5rem", marginBottom: "1rem" }}>
        <div style={{ fontSize: "11px", letterSpacing: "0.5px", color: C.textTertiary, marginBottom: "1rem" }}>PIANO D'AZIONE</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {result.actionPlan.map((item) => (
            <div key={item.priority} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px", background: C.input, borderRadius: "12px" }}>
              <div style={{ width: "22px", height: "22px", borderRadius: "50%", background: C.purple, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 500, color: "#fff", flexShrink: 0 }}>{item.priority}</div>
              <div style={{ flex: 1, fontSize: "13px", color: C.textPrimary, lineHeight: 1.5 }}>{item.action}</div>
              <div style={{ fontSize: "10px", fontWeight: 500, padding: "3px 8px", borderRadius: "99px", flexShrink: 0, ...impactStyle(item.impact) }}>{item.impact}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setResult(null); setBusinessName(""); setCity("") }}
        style={{ width: "100%", padding: "13px", background: "transparent", border: `0.5px solid ${C.border}`, borderRadius: "12px", fontSize: "14px", color: C.textSecondary, cursor: "pointer", marginTop: "0.5rem" }}
      >
        Nuova analisi
      </button>

    </div>
  )

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", padding: "0 1.5rem", textAlign: "center", position: "relative", overflow: "hidden" }}>

      <div style={{ position: "absolute", top: "10%", left: "50%", transform: "translateX(-50%)", width: "600px", height: "300px", background: "radial-gradient(ellipse at center, rgba(127,119,221,0.15) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ fontSize: "36px", fontWeight: 500, letterSpacing: "-2px", lineHeight: 1.1, marginBottom: "1rem", maxWidth: "420px", color: C.textPrimary, position: "relative" }}>
        Scopri quanto è visibile<br />la tua attività online
      </div>

      <div style={{ fontSize: "15px", color: C.textSecondary, marginBottom: "2.5rem", maxWidth: "320px", lineHeight: 1.6, position: "relative" }}>
        Analisi completa in 30 secondi. Recensioni, posizionamento, social e piano d'azione.
      </div>

      <div style={{ width: "100%", maxWidth: "400px", background: C.card, border: `0.5px solid ${C.border}`, borderRadius: "20px", padding: "1.5rem", marginBottom: "1rem", position: "relative" }}>
        <div style={{ marginBottom: "1rem", textAlign: "left" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.5px", color: C.textTertiary, marginBottom: "6px" }}>NOME ATTIVITÀ</div>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Es. Pizzeria Da Mario"
            style={{ width: "100%", fontSize: "15px", padding: "10px 14px", background: C.inputLanding, border: `0.5px solid ${C.border}`, borderRadius: "10px", color: C.textPrimary, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <div style={{ marginBottom: "1.25rem", textAlign: "left" }}>
          <div style={{ fontSize: "11px", letterSpacing: "0.5px", color: C.textTertiary, marginBottom: "6px" }}>CITTÀ</div>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Es. Milano"
            style={{ width: "100%", fontSize: "15px", padding: "10px 14px", background: C.inputLanding, border: `0.5px solid ${C.border}`, borderRadius: "10px", color: C.textPrimary, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={!businessName || !city}
          style={{ width: "100%", padding: "13px", background: !businessName || !city ? C.input : C.purple, border: "none", borderRadius: "12px", fontSize: "15px", fontWeight: 500, color: !businessName || !city ? C.textTertiary : "#fff", cursor: !businessName || !city ? "not-allowed" : "pointer", transition: "all 0.2s ease", letterSpacing: "-0.2px" }}
        >
          Analizza
        </button>
        {error && <p style={{ marginTop: "1rem", fontSize: "13px", color: "#E24B4A", textAlign: "center" }}>{error}</p>}
      </div>

      <div style={{ fontSize: "12px", color: C.textTertiary, position: "relative" }}>
        Gratuito · Nessuna registrazione richiesta
      </div>

    </div>
  )
}