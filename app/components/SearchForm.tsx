"use client"

import { useState } from "react"

type AnalysisResult = {
  businessName: string
  city: string
  omniScore: number
  reputation: {
    score: number
    rating: number
    totalReviews: number
  }
  visibility: {
    score: number
    foundOnGoogle: boolean
    hasWebsite: boolean
    websiteUrl: string | null
  }
  social: {
    score: number
    hasInstagram: boolean
    hasFacebook: boolean
  }
  analysis: {
    strengths: string[]
    weaknesses: string[]
    summary: string
    sentimentScore: number
  } | null
  details: {
    address: string
    phone: string | null
    website: string | null
    googleMapsUrl: string
    isOpen: boolean | null
  }
  actionPlan: {
    priority: number
    action: string
    impact: string
  }[]
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
      if (!response.ok) {
        setError(data.error || "Qualcosa è andato storto")
        return
      }
      setResult(data)
    } catch (err) {
      setError("Errore di connessione. Riprova.")
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  const getImpactColor = (impact: string) => {
    if (impact === "Alto") return "bg-red-100 text-red-700"
    if (impact === "Medio") return "bg-yellow-100 text-yellow-700"
    return "bg-green-100 text-green-700"
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Nome attività</label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Es. Pizzeria Da Mario"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Città</label>
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Es. Milano"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isLoading || !businessName || !city}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Analisi in corso..." : "Analizza"}
        </button>
        {error && <p className="mt-4 text-red-500 text-sm text-center">{error}</p>}
      </div>

      {result && (
        <div className="space-y-6">

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <p className="text-gray-500 text-sm font-medium mb-2">OMNI SCORE</p>
            <p className={`text-8xl font-bold ${getScoreColor(result.omniScore)}`}>{result.omniScore}</p>
            <p className="text-gray-400 text-sm mt-2">su 100</p>
            <p className="text-gray-600 text-sm mt-3 font-medium">{result.businessName} · {result.city}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
              <p className="text-xs text-gray-500 font-medium mb-2">REPUTAZIONE</p>
              <p className={`text-4xl font-bold ${getScoreColor(result.reputation.score)}`}>{result.reputation.score}</p>
              <p className="text-xs text-gray-400 mt-2">{"⭐"} {result.reputation.rating}</p>
              <p className="text-xs text-gray-400">{result.reputation.totalReviews} recensioni</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
              <p className="text-xs text-gray-500 font-medium mb-2">{"VISIBILITÀ"}</p>
              <p className={`text-4xl font-bold ${getScoreColor(result.visibility.score)}`}>{result.visibility.score}</p>
              <p className="text-xs text-gray-400 mt-2">{result.visibility.foundOnGoogle ? "Su Google" : "Non su Google"}</p>
              <p className="text-xs text-gray-400">{result.visibility.hasWebsite ? "Sito web" : "Nessun sito"}</p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-5 text-center">
              <p className="text-xs text-gray-500 font-medium mb-2">SOCIAL</p>
              <p className={`text-4xl font-bold ${getScoreColor(result.social.score)}`}>{result.social.score}</p>
              <p className="text-xs text-gray-400 mt-2">{result.social.hasInstagram ? "Instagram" : "No Instagram"}</p>
              <p className="text-xs text-gray-400">{result.social.hasFacebook ? "Facebook" : "No Facebook"}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Dettagli</h3>
            <div className="space-y-2 text-sm text-gray-600">
              {result.details.address && <p>{result.details.address}</p>}
              {result.details.phone && <p>{result.details.phone}</p>}
              {result.details.isOpen !== null && (
                <p>{result.details.isOpen ? "Aperto ora" : "Chiuso ora"}</p>
              )}
            </div>
          </div>

          {result.analysis && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Analisi AI</h3>
              <p className="text-sm text-gray-600 mb-5 italic">{result.analysis.summary}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-green-700 mb-3">Punti di forza</h4>
                  <ul className="space-y-2">
                    {result.analysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-gray-600 bg-green-50 rounded-lg p-3">{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-red-700 mb-3">{"Criticità"}</h4>
                  <ul className="space-y-2">
                    {result.analysis.weaknesses.map((w, i) => (
                      <li key={i} className="text-sm text-gray-600 bg-red-50 rounded-lg p-3">{w}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Piano d'azione</h3>
            <div className="space-y-3">
              {result.actionPlan.map((item) => (
                <div key={item.priority} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {item.priority}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{item.action}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full shrink-0 ${getImpactColor(item.impact)}`}>
                    {item.impact}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}