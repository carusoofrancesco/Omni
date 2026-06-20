"use client"

import { useState } from "react"

// Definiamo la struttura dei dati che arrivano dall'API
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
  }
  social: {
    score: number
    hasInstagram: boolean
    hasFacebook: boolean
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

  // Funzione per colorare lo score
  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-green-600"
    if (score >= 50) return "text-yellow-500"
    return "text-red-500"
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Form */}
      <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nome attività
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="Es. Pizzeria Da Mario"
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Città
          </label>
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

        {error && (
          <p className="mt-4 text-red-500 text-sm text-center">{error}</p>
        )}
      </div>

      {/* Risultati */}
      {result && (
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Omni Score */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-1">OMNI SCORE</p>
            <p className={`text-7xl font-bold ${getScoreColor(result.omniScore)}`}>
              {result.omniScore}
            </p>
            <p className="text-gray-400 text-sm mt-1">su 100</p>
          </div>

          {/* Sezioni */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">REPUTAZIONE</p>
              <p className={`text-3xl font-bold ${getScoreColor(result.reputation.score)}`}>
                {result.reputation.score}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                ⭐ {result.reputation.rating} · {result.reputation.totalReviews} recensioni
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">VISIBILITÀ</p>
              <p className={`text-3xl font-bold ${getScoreColor(result.visibility.score)}`}>
                {result.visibility.score}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {result.visibility.foundOnGoogle ? "✅ Su Google" : "❌ Non su Google"}
              </p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">SOCIAL</p>
              <p className={`text-3xl font-bold ${getScoreColor(result.social.score)}`}>
                {result.social.score}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {result.social.hasInstagram ? "✅ Instagram" : "❌ Instagram"}
              </p>
            </div>
          </div>

          {/* Piano d'azione */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Piano d'azione</h3>
            <div className="space-y-3">
              {result.actionPlan.map((item) => (
                <div
                  key={item.priority}
                  className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                >
                  <span className="bg-blue-600 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
                    {item.priority}
                  </span>
                  <div>
                    <p className="text-sm text-gray-800">{item.action}</p>
                    <p className="text-xs text-gray-400 mt-1">Impatto: {item.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}