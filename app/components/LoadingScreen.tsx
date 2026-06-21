"use client"

import { useEffect, useState } from "react"

const steps = [
  { text: "Connessione a Google...",  pct: 12 },
  { text: "Attività trovata",         pct: 30 },
  { text: "Recupero recensioni...",   pct: 48 },
  { text: "Recensioni caricate",      pct: 62 },
  { text: "Analisi AI in corso...",   pct: 78 },
  { text: "Calcolo Omni Score...",    pct: 92 },
  { text: "Tutto pronto",             pct: 100 },
]

export default function LoadingScreen({ businessName, city }: { businessName: string; city: string }) {
  const [currentStep, setCurrentStep] = useState(0)
  const [phase, setPhase] = useState<"in" | "out">("in")
  const [displayText, setDisplayText] = useState(steps[0].text)

  useEffect(() => {
    if (currentStep >= steps.length - 1) return

    const timer = setTimeout(() => {
      setPhase("out")
      setTimeout(() => {
        const next = currentStep + 1
        setCurrentStep(next)
        setDisplayText(steps[next].text)
        setPhase("in")
      }, 350)
    }, 1600)

    return () => clearTimeout(timer)
  }, [currentStep])

  const progress = steps[currentStep].pct

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-80 text-center">

        <div className="mb-12">
          <div style={{ fontSize: "30px", fontWeight: 500, letterSpacing: "-1.8px" }}
            className="text-gray-900">
            omni
          </div>
          {businessName && (
            <div className="text-xs text-gray-400 mt-2 tracking-wide uppercase">
              {businessName} · {city}
            </div>
          )}
        </div>

        <div className="flex justify-center mb-12">
          <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="24" fill="none" stroke="#e5e7eb" strokeWidth="1.5"/>
            <circle
              cx="32" cy="32" r="24"
              fill="none"
              stroke="#7F77DD"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="94 57"
              style={{
                transformOrigin: "32px 32px",
                animation: "omniSpin 2.2s cubic-bezier(0.37,0,0.63,1) infinite",
              }}
            />
          </svg>
        </div>

        <div style={{ position: "relative", height: "24px", overflow: "hidden", marginBottom: "3rem" }}>
          <span
            key={currentStep}
            style={{
              position: "absolute",
              width: "100%",
              left: 0,
              fontSize: "15px",
              fontWeight: 400,
              letterSpacing: "-0.2px",
              animation: phase === "in"
                ? "omniIn 0.7s cubic-bezier(0.16,1,0.3,1) forwards"
                : "omniOut 0.35s cubic-bezier(0.4,0,1,1) forwards",
            }}
            className="text-gray-900"
          >
            {displayText}
          </span>
        </div>

        <div style={{ background: "#e5e7eb", borderRadius: "99px", height: "1.5px", overflow: "hidden" }}>
          <div
            style={{
              height: "1.5px",
              background: "linear-gradient(90deg, #AFA9EC, #7F77DD)",
              borderRadius: "99px",
              width: `${progress}%`,
              transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        </div>

      </div>

      <style>{`
        @keyframes omniSpin {
          0%,100% { transform: rotate(0deg);   stroke-dashoffset: 94; }
          35%     { transform: rotate(160deg); stroke-dashoffset: 18; }
          65%     { transform: rotate(280deg); stroke-dashoffset: 54; }
          100%    { transform: rotate(360deg); stroke-dashoffset: 94; }
        }
        @keyframes omniIn {
          from { opacity: 0; transform: translateY(12px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0); }
        }
        @keyframes omniOut {
          0%   { opacity: 1; transform: translateY(0);     filter: blur(0); }
          30%  { opacity: 0.4; transform: translateY(-6px); filter: blur(3px); }
          100% { opacity: 0; transform: translateY(-14px); filter: blur(8px); }
        }
      `}</style>
    </div>
  )
}