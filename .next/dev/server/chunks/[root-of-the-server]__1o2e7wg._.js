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
                "X-Goog-FieldMask": "places.id,places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.types"
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
            types: place.types || [],
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
    ()=>analyzeReviews,
    "generateKeywords",
    ()=>generateKeywords,
    "inferBusinessType",
    ()=>inferBusinessType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__ = __turbopack_context__.i("[project]/node_modules/@anthropic-ai/sdk/client.mjs [app-route] (ecmascript) <export Anthropic as default>");
;
async function analyzeReviews(businessName, reviews) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
        console.error("ANTHROPIC_API_KEY non configurata");
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
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__["default"]({
            apiKey
        });
        const reviewsText = reviews.map((r)=>`- [${r.rating}/5] ${r.text}`).join("\n");
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
- sentimentScore: numero da 0 a 100 che rappresenta il sentiment generale`
                }
            ]
        });
        const rawText = message.content[0].type === "text" ? message.content[0].text.trim() : "";
        const text = rawText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        console.log("Claude risposta:", text);
        const parsed = JSON.parse(text);
        return parsed;
    } catch (error) {
        console.error("Errore AI analysis:", error);
        return null;
    }
}
async function inferBusinessType(businessName, types) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return "attività";
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__["default"]({
            apiKey
        });
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

Rispondi solo con il tipo, nient'altro.`
                }
            ]
        });
        const text = message.content[0].type === "text" ? message.content[0].text.trim() : "attività";
        console.log("Tipo attività inferito:", text);
        return text;
    } catch (error) {
        console.error("Errore inferBusinessType:", error);
        return "attività";
    }
}
async function generateKeywords(businessName, city, businessType) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) return [
        `${businessType} ${city}`
    ];
    try {
        const client = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$anthropic$2d$ai$2f$sdk$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__Anthropic__as__default$3e$__["default"]({
            apiKey
        });
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

Esempio formato: ["ricerca 1", "ricerca 2", "ricerca 3", "ricerca 4", "ricerca 5"]`
                }
            ]
        });
        const text = message.content[0].type === "text" ? message.content[0].text.trim() : "[]";
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        const keywords = JSON.parse(cleaned);
        console.log("Keyword generate:", keywords);
        return keywords;
    } catch (error) {
        console.error("Errore generateKeywords:", error);
        return [
            `${businessType} ${city}`,
            `${businessType} a ${city}`
        ];
    }
}
}),
"[project]/app/lib/serpapi.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getReviews",
    ()=>getReviews
]);
async function getReviews(placeId) {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        console.error("SERPAPI_KEY non configurata");
        return [];
    }
    try {
        const reviewsUrl = `https://serpapi.com/search.json?engine=google_maps_reviews&place_id=${placeId}&api_key=${apiKey}&hl=it`;
        const reviewsResponse = await fetch(reviewsUrl);
        const reviewsData = await reviewsResponse.json();
        console.log("SerpApi status:", reviewsData?.search_metadata?.status);
        console.log("SerpApi recensioni trovate:", reviewsData?.reviews?.length ?? 0);
        if (!reviewsData.reviews || reviewsData.reviews.length === 0) {
            return [];
        }
        return reviewsData.reviews.map((r)=>({
                author: r.user?.name || "Anonimo",
                rating: r.rating || 0,
                text: r.snippet || "",
                time: r.date || ""
            }));
    } catch (error) {
        console.error("Errore SerpApi:", error);
        return [];
    }
}
}),
"[project]/app/lib/discoverability.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "analyzeDiscoverability",
    ()=>analyzeDiscoverability
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$ai$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/ai-analysis.ts [app-route] (ecmascript)");
;
function calculateScore(inLocalPack, localPackPosition, position) {
    if (inLocalPack && localPackPosition !== null) {
        if (localPackPosition === 1) return 100;
        if (localPackPosition === 2) return 85;
        return 70;
    }
    if (position !== null) {
        if (position <= 3) return 60;
        if (position <= 10) return 40;
        return 20;
    }
    return 0;
}
async function analyzeDiscoverability(businessName, city, businessType) {
    const apiKey = process.env.SERPAPI_KEY;
    if (!apiKey) {
        console.error("SERPAPI_KEY non configurata");
        return {
            score: 0,
            keywords: []
        };
    }
    const keywords = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$ai$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateKeywords"])(businessName, city, businessType);
    const results = [];
    for (const keyword of keywords){
        try {
            const locationQuery = `${city}, Italy`;
            const url = `https://serpapi.com/search.json?engine=google&q=${encodeURIComponent(keyword)}&location=${encodeURIComponent(locationQuery)}&hl=it&gl=it&api_key=${apiKey}`;
            const response = await fetch(url);
            const data = await response.json();
            console.log(`SerpApi keyword "${keyword}": ${data?.search_metadata?.status}`);
            let position = null;
            let inLocalPack = false;
            let localPackPosition = null;
            if (data.local_results) {
                const localIndex = data.local_results.findIndex((r)=>r.title?.toLowerCase().includes(businessName.toLowerCase()));
                if (localIndex !== -1) {
                    inLocalPack = true;
                    localPackPosition = localIndex + 1;
                }
            }
            if (!inLocalPack && data.organic_results) {
                const organicIndex = data.organic_results.findIndex((r)=>r.title?.toLowerCase().includes(businessName.toLowerCase()) || r.snippet?.toLowerCase().includes(businessName.toLowerCase()));
                if (organicIndex !== -1) {
                    position = organicIndex + 1;
                }
            }
            const score = calculateScore(inLocalPack, localPackPosition, position);
            results.push({
                keyword,
                position,
                inLocalPack,
                localPackPosition,
                score
            });
            await new Promise((r)=>setTimeout(r, 300));
        } catch (error) {
            console.error(`Errore keyword "${keyword}":`, error);
            results.push({
                keyword,
                position: null,
                inLocalPack: false,
                localPackPosition: null,
                score: 0
            });
        }
    }
    const avgScore = results.length > 0 ? Math.round(results.reduce((sum, r)=>sum + r.score, 0) / results.length) : 0;
    console.log("Discoverability score finale:", avgScore);
    return {
        score: avgScore,
        keywords: results
    };
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
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$serpapi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/serpapi.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$discoverability$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/app/lib/discoverability.ts [app-route] (ecmascript)");
;
;
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
        if (!placesData) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Attività non trovata su Google. Prova a essere più specifico."
            }, {
                status: 404
            });
        }
        // 2 — Recensioni da SerpApi
        const reviews = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$serpapi$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getReviews"])(placesData.placeId);
        console.log("Recensioni da SerpApi:", reviews.length);
        // 3 — Analisi AI delle recensioni
        const aiAnalysis = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$ai$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeReviews"])(businessName, reviews);
        console.log("AI Analysis:", aiAnalysis);
        // 4 — Tipo di attività
        const businessType = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$ai$2d$analysis$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["inferBusinessType"])(placesData.name, placesData.types);
        console.log("Tipo attività:", businessType);
        // 5 — Discoverability
        const discoverability = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$lib$2f$discoverability$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["analyzeDiscoverability"])(businessName, city, businessType);
        console.log("Discoverability:", discoverability);
        // 6 — Calcolo punteggi
        const reputationScore = calculateReputationScore(placesData.rating, placesData.totalReviews, aiAnalysis?.sentimentScore ?? null);
        const visibilityScore = calculateVisibilityScore(placesData, discoverability.score);
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
                websiteUrl: isRealWebsite(placesData.website) ? placesData.website : null,
                discoverability: {
                    score: discoverability.score,
                    keywords: discoverability.keywords
                }
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
            actionPlan: generateActionPlan(placesData, aiAnalysis, discoverability)
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
function calculateVisibilityScore(placesData, discoverabilityScore) {
    let score = 0;
    if (isRealWebsite(placesData.website)) score += 30;
    if (placesData.phoneNumber) score += 20;
    if (placesData.isOpen !== null) score += 15;
    score += Math.round(discoverabilityScore * 0.35);
    return Math.min(score, 100);
}
function generateActionPlan(placesData, aiAnalysis, discoverability) {
    const actions = [];
    const poorKeywords = discoverability.keywords.filter((k)=>k.score === 0);
    if (poorKeywords.length > 2) {
        actions.push({
            priority: actions.length + 1,
            action: `Non appari per ${poorKeywords.length} ricerche su ${discoverability.keywords.length} — ottimizza la scheda Google Business con parole chiave rilevanti`,
            impact: "Alto"
        });
    }
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
            action: `Il tuo rating è ${placesData.rating}/5 — rispondere a tutte le recensioni può migliorarlo`,
            impact: "Alto"
        });
    }
    if (!isRealWebsite(placesData.website)) {
        actions.push({
            priority: actions.length + 1,
            action: placesData.website?.includes("facebook.com") ? "Hai solo una pagina Facebook come sito — crea un sito web professionale" : "Crea un sito web — le attività con sito ricevono il 35% di contatti in più",
            impact: "Alto"
        });
    }
    if (aiAnalysis?.weaknesses && aiAnalysis.weaknesses.length > 0) {
        actions.push({
            priority: actions.length + 1,
            action: `Lavora su: ${aiAnalysis.weaknesses[0].toLowerCase()}`,
            impact: "Medio"
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

//# sourceMappingURL=%5Broot-of-the-server%5D__1o2e7wg._.js.map