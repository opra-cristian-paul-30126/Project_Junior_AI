import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

function buildPrompt({ destination, days, budget, travelStyle, interests, startDate }) {
    const dateContext = startDate
        ? `\n - Travel dates: Starting ${new Date(startDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        - Suggest activities appropriate for this time of year. Consider weather, seasonal events, and festivals.`
        : ''
    return `You are an expert travel planner. Create a detailed ${days}-day travel
    itinerary for ${destination}.
    
    Travel preferences:
    - Budget level: ${budget}
    - Travel style: ${travelStyle}
    - Special interests: ${interests || 'general sightseeing'}${dateContext}
    
    IMPORTANT: Respond ONLY with valid JSON in this exact format, no markdown, no
    explanation:
    {
        "trip_title": "A short catchy title for the trip",
        "days": [
            {
                "day_number": 1,
                "title": "Day title (e.g. 'Historic Old Town & Local Cuisine')",
                "description": "Brief overview of what this day covers",
                "activities": [
                    {
                        "time_of_day": "morning",
                        "name": "Activity name",
                        "location": "Specific location or address",
                        "notes": "Helpful tips, costs, or details (2-3 sentences)",
                        "type": "culture"
                    }
                ]
            }
        ]
    }
    
    Rules:
       - Each day MUST have exactly 3 activities: one for morning, one for afternoon, one for evening
        - time_of_day must be one of: "morning", "afternoon", "evening"
        - type must be one of: "food", "culture", "outdoor", "shopping", "nightlife"
        - For "location", ALWAYS provide a SPECIFIC real place name with address or neighborhood (e.g. "Trattoria da Mario, Via Roma 15" or "Deva Citadel, Strada Cetății"). NEVER use generic descriptions like "a hotel spa" or "a local restaurant"
        - Include practical tips in notes: estimated costs, opening hours, booking advice, or insider tips (2-3 sentences)
        - Tailor activities to the ${budget} budget level and ${travelStyle} travel style
        - For user interests: ONLY incorporate them if they are realistic and verifiable (e.g. "local food" or "arhitecture").
        If the user mentions specific events (concert, festival, exhibition), only include it if you are confident it actually
        exists at that destination and time. If you cannot verify it, IGNORE the specific event and instead suggest similar alternatives
        (e.g. if user says "The Weeknd concert" but none exists, suggest the city's best live music instead). NEVER invent or confirm events
        you are unsure about.
        - Return ONLY the JSON object, nothing else
        `
}

function validateItinerary(data) {
    // Check top-level structure
    if (!data || !data.trip_title || !Array.isArray(data.days)) {
        throw new Error('Invalid itinerary structure: missing trip_title or days array')
    }

    const validTimeOfDay = ['morning', 'afternoon', 'evening']
    const validTypes = ['food', 'culture', 'outdoor', 'shopping', 'nightlife']

    // Validate each day
    data.days.forEach((day, dayIndex) => {
        if (!day.day_number || !day.title || !Array.isArray(day.activities)) {
            throw new Error(`Day ${dayIndex + 1} is missing required fields`)
        }

        // Validate each activity
        day.activities.forEach((activity, actIndex) => {
            if (!activity.name || !activity.time_of_day || !activity.type) {
                throw new Error(`Activity ${actIndex + 1} on day ${dayIndex + 1} is missing required fields`)
            }
            if (!validTimeOfDay.includes(activity.time_of_day)) {
                throw new Error(`Invalid time_of_day "${activity.time_of_day}" - must be
    morning, afternoon or evening`)
            }
            if (!validTypes.includes(activity.type)) {
                throw new Error(`Invalid type "${activity.type}" - must be food, culture,
        outdoor, shopping or nightlife`)
            }
        })
    })

    return data
}

export async function generateItinerary(tripDetails) {
    const prompt = buildPrompt(tripDetails)

    try {
        const result = await model.generateContent(prompt)
        const response = result.response
        let text = response.text()

        // Clean up: Gemini sometimes wraps JSON in markdown code blocks
        text = text.replace(/```json\n ? /g, '').replace(/```\n?/g, '').trim()

        // Parse and validate
        const itinerary = JSON.parse(text)
        return validateItinerary(itinerary)
    } catch (error) {
        if (error instanceof SyntaxError) {
            throw new Error('Gemini returned invalid JSON. Please try again.')
        }
        throw error
    }
}