module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/lib/google-places.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getPlacesData",
    ()=>getPlacesData
]);
async function getPlacesData(businessName, city) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        throw new Error("GOOGLE_API_KEY non configurata");
    }
    try {
        const searchResponse = await fetch("https://places.googleapis.com/v1/places:searchText", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress"
            },
            body: JSON.stringify({
                textQuery: `${businessName} ${city}`,
                languageCode: "it"
            })
        });
        const searchData = await searchResponse.json();
        console.log("Google Places risposta:", JSON.stringify(searchData, null, 2));
        if (!searchData.places || searchData.places.length === 0) {
            return null;
        }
        const place = searchData.places[0];
        const placeId = place.id;
        const detailsResponse = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
            headers: {
                "X-Goog-Api-Key": apiKey,
                "X-Goog-FieldMask": "id,displayName,rating,userRatingCount,formattedAddress,nationalPhoneNumber,websiteUri,regularOpeningHours,googleMapsUri,reviews.rating,reviews.text,reviews.authorAttribution,reviews.relativePublishTimeDescription"
            }
        });
        const details = await detailsResponse.json();
        console.log("Google Places dettagli:", JSON.stringify(details, null, 2));
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
            reviews: (details.reviews || []).map((r)=>({
                    author: r.authorAttribution?.displayName || "Anonimo",
                    rating: r.rating,
                    text: r.text?.text || "",
                    time: r.relativePublishTimeDescription || ""
                }))
        };
    } catch (error) {
        console.error("Errore Google Places API:", error);
        return null;
    }
}
}),
"[project]/app/lib/ai-analysis.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeReviews",
    ()=>analyzeReviews
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@google/generative-ai/dist/index.mjs [app-route] (ecmascript)");
;
async function analyzeReviews(businessName, reviews) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error("GEMINI_API_KEY non configurata");
        return null;
    }
    if (reviews.length === 0) {
        return {
            strengths: [
                "Presenza su Google Maps"
            ],
            weaknesses: [
                "Nessuna recensione disponibile per l'analisi"
            ],
            summary: "Non ci sono ancora recensioni sufficienti per un'analisi dettagliata.",
            sentimentScore: 50
        };
    }
    try {
        const genAI = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$google$2f$generative$2d$ai$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GoogleGenerativeAI"](apiKey);
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash"
        });
        // Prepariamo le recensioni in formato leggibile
        const reviewsText = reviews.map((r)=>`- [${r.rating}/5] ${r.text}`).join("\n");
        const prompt = `
Sei un esperto di marketing locale. Analizza queste recensioni Google di "${businessName}" e rispondi SOLO con un JSON valido, senza testo aggiuntivo, senza backtick, senza markdown.

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
- sentimentScore: numero da 0 a 100 che rappresenta il sentiment generale
`;
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();
        console.log("Gemini risposta:", text);
        const parsed = JSON.parse(text);
        return parsed;
    } catch (error) {
        console.error("Errore AI analysis:", error);
        return null;
    }
}
}),
"[project]/app/api/analyze/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$google$2d$places$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/google-places.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$ai$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/ai-analysis.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { businessName, city } = body;
        console.log("ENV CHECK:", process.env.GOOGLE_API_KEY ? "chiave trovata" : "chiave NON trovata");
        if (!businessName || !city) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Nome attività e città sono obbligatori"
            }, {
                status: 400
            });
        }
        // 1 — Dati Google Places
        const placesData = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$google$2d$places$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPlacesData"])(businessName, city);
        console.log("Recensioni trovate:", placesData?.reviews?.length ?? 0);
        if (!placesData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Attività non trovata su Google. Prova a essere più specifico."
            }, {
                status: 404
            });
        }
        // 2 — Analisi AI delle recensioni
        const aiAnalysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$ai$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeReviews"])(businessName, placesData.reviews);
        // 3 — Calcolo punteggi
        const reputationScore = calculateReputationScore(placesData.rating, placesData.totalReviews, aiAnalysis?.sentimentScore ?? null);
        const visibilityScore = calculateVisibilityScore(placesData);
        const socialScore = 50;
        // Omni Score = media pesata
        const omniScore = Math.round(reputationScore * 0.4 + visibilityScore * 0.35 + socialScore * 0.25);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            businessName: placesData.name,
            city,
            omniScore,
            reputation: {
                score: reputationScore,
                rating: placesData.rating,
                totalReviews: placesData.totalReviews
            },
            visibility: {
                score: visibilityScore,
                foundOnGoogle: true,
                hasWebsite: isRealWebsite(placesData.website),
                websiteUrl: isRealWebsite(placesData.website) ? placesData.website : null
            },
            social: {
                score: socialScore,
                hasInstagram: false,
                hasFacebook: false
            },
            analysis: aiAnalysis ? {
                strengths: aiAnalysis.strengths,
                weaknesses: aiAnalysis.weaknesses,
                summary: aiAnalysis.summary,
                sentimentScore: aiAnalysis.sentimentScore
            } : null,
            details: {
                address: placesData.address,
                phone: placesData.phoneNumber,
                website: placesData.website,
                googleMapsUrl: placesData.googleMapsUrl,
                isOpen: placesData.isOpen
            },
            actionPlan: generateActionPlan(placesData, aiAnalysis)
        });
    } catch (error) {
        console.error("Errore analyze:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Errore interno del server"
        }, {
            status: 500
        });
    }
}
// --- Funzioni di supporto ---
function isRealWebsite(url) {
    if (!url) return false;
    const notRealWebsites = [
        "facebook.com",
        "instagram.com",
        "tripadvisor",
        "google.com"
    ];
    return !notRealWebsites.some((fake)=>url.includes(fake));
}
function calculateReputationScore(rating, totalReviews, sentimentScore) {
    if (rating === 0) return 0;
    const ratingScore = rating / 5 * 60;
    const reviewScore = Math.min(totalReviews / 100 * 20, 20);
    const sentiment = sentimentScore ?? 50;
    const sentimentContribution = sentiment / 100 * 20;
    return Math.round(ratingScore + reviewScore + sentimentContribution);
}
function calculateVisibilityScore(placesData) {
    let score = 0;
    score += 40;
    if (isRealWebsite(placesData.website)) score += 30;
    if (placesData.phoneNumber) score += 15;
    if (placesData.isOpen !== null) score += 15;
    return Math.min(score, 100);
}
function generateActionPlan(placesData, aiAnalysis) {
    const actions = [];
    if (placesData.totalReviews < 200) {
        actions.push({
            priority: actions.length + 1,
            action: `Hai ${placesData.totalReviews} recensioni — aumentarle migliora il posizionamento su Google Maps`,
            impact: "Alto"
        });
    }
    if (placesData.rating < 4.5) {
        actions.push({
            priority: actions.length + 1,
            action: `Il tuo rating è ${placesData.rating}/5 — rispondere a tutte le recensioni (positive e negative) può migliorarlo`,
            impact: "Alto"
        });
    }
    if (!isRealWebsite(placesData.website)) {
        actions.push({
            priority: actions.length + 1,
            action: placesData.website?.includes("facebook.com") ? "Hai solo una pagina Facebook come sito — crea un sito web professionale per aumentare la credibilità" : "Crea un sito web — le attività con sito ricevono il 35% di contatti in più",
            impact: "Alto"
        });
    }
    if (!placesData.phoneNumber) {
        actions.push({
            priority: actions.length + 1,
            action: "Aggiungi un numero di telefono alla scheda Google Business",
            impact: "Medio"
        });
    }
    if (placesData.isOpen === null) {
        actions.push({
            priority: actions.length + 1,
            action: "Configura gli orari di apertura su Google Business — i clienti li cercano spesso",
            impact: "Medio"
        });
    }
    // Se l'AI ha trovato criticità, le aggiungiamo come suggerimenti
    if (aiAnalysis?.weaknesses && aiAnalysis.weaknesses.length > 0) {
        actions.push({
            priority: actions.length + 1,
            action: `Lavora su: ${aiAnalysis.weaknesses[0].toLowerCase()}`,
            impact: "Alto"
        });
    }
    actions.push({
        priority: actions.length + 1,
        action: "Rispondi alle recensioni recenti — aumenta la fiducia dei nuovi clienti",
        impact: "Medio"
    });
    return actions.slice(0, 3);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__1m81c1q._.js.map