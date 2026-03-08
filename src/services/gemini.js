const API_URL = import.meta.env.VITE_API_URL

export async function generateItinerary(tripDetails) {
    const response = await fetch(`${API_URL}/api/generate-itinerary`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            destination: tripDetails.destination,
            days: tripDetails.days,
            budget: tripDetails.budget,
            travel_style: tripDetails.travelStyle,
            interests: tripDetails.interests || null,
            start_date: tripDetails.startDate || null,
        }),
    })
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.detail || 'Failed to generate itinerary')
    }
    return response.json()
}