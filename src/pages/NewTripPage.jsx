import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import PageWrapper from '../components/layout/PageWrapper'
import { generateItinerary } from '../services/gemini'
import { createTrip } from '../services/tripService'
import { saveItinerary } from '../services/itineraryServices'
import { FiSend, FiMapPin, FiCalendar, FiDollarSign, FiCompass, FiHeart } from 'react-icons/fi'

const BUDGET_OPTIONS = [
    { value: 'low', label: 'Budget', desc: 'Hostels, street food, public transport' },
    { value: 'mid', label: 'Mid-Range', desc: 'Hotels, restaurants, some tours' },
    { value: 'luxury', label: 'Luxury', desc: 'Premium hotels, fine dining, private tours' },
]

const STYLE_OPTIONS = [
    { value: 'adventure', label: 'Adventure', desc: 'Hiking, sports, thrills' },
    { value: 'cultural', label: 'Cultural', desc: 'Museums, history, local traditions' },
    { value: 'relaxed', label: 'Relaxed', desc: 'Beaces, spas, slow travel' },
    { value: 'foodie', label: 'Foodie', desc: 'Local cuisine, markets, food tours' },
]

const TRAVEL_QUOTES = [
    "The world is a book and those who do not travel read only one page...",
    "Travel makes one modest - you see what a tiny place you occupy in this world...",
    "Not all those who wander are lost...",
    "Adventure is worthwhile in itself...",
    "Life is short and the world is wide...",
]

export default function NewTripPage() {
    const [destination, setDestination] = useState('')
    const [days, setDays] = useState(3)
    const [budget, setBudget] = useState('mid')
    const [travelStyle, setTravelStyle] = useState('cultural')
    const [interests, setInterests] = useState('')
    const [startDate, setStartDate] = useState('')
    const [loading, setLoading] = useState(false)
    const [quote] = useState(
        TRAVEL_QUOTES[Math.floor(Math.random() * TRAVEL_QUOTES.length)]
    )
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Generate itinerary with Gemini
            toast.loading('AI is planning your trip', { id: 'generating' })
            const itinerary = await generateItinerary({
                destination,
                days,
                budget,
                travelStyle,
                interests,
                startDate,
            })

            // 2. Save trip to Supabase
            toast.loading('Saving your itinerary...', { id: 'generating' })
            const trip = await createTrip({ destination, days, budget, travelStyle, startDate, interests })

            // 3. Save itinerary days + activities
            await saveItinerary(trip.id, itinerary.days)

            toast.success('Your trip is ready!', { id: 'generating' })

            queryClient.invalidateQueries({ queryKey: ['trips'] })
            navigate(`/itinerary/${trip.id}`)
        } catch (error) {
            console.error('Trip creation failed: ', error)
            toast.error(error.message || 'Failed to generate trip. Please try again.', {
                id: 'generating',
            })
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <PageWrapper>
                <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full border-4 border-white/10 border-t-primary-400
                        animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl">✈️</span>
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-white mt-8 mb-3">
                        Planning your adventure...
                    </h2>
                    <p className="text-white/50 text-center max-w-md italic">"{quote}"</p>
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div className="max-w-2xl mx-auto animate-fade-in">
                <h1 className="text-3xl font-bold text-white mb-2">Plan a New Trip</h1>
                <p className="text-white/50 mb-8">
                    Tell us about your dream destination and we'll create the perfect itinerary.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Destination */}
                    <div className="glass p-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <FiMapPin className="text-accent-400" /> Destination
                        </label>
                        <input
                            type="text"
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4
                            text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50
                            focus:ring-1 focus:ring-primary-500/50 transition-all"
                            placeholder="e.g Tokyo, Japan"
                            required
                        />
                    </div>

                    {/* Number of Days */}
                    <div className="glass p-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <FiCalendar className="text-accent-400" /> Number of Days
                        </label>
                        <input
                            type="number"
                            value={days}
                            onChange={(e) => setDays(parseInt(e.target.value))}
                            min={1}
                            max={30}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4
                            text-white focus:outline-none focus:border-primary-500/50 focus:ring-1
                            focus:ring-primary-500/50 transition-all"
                            required
                        />
                    </div>

                    {/* Start Date */}
                    <div className="glass p-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <FiCalendar className="text-accent-400" /> Start Date (optional)
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white
                            focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/50
                            transition-all"
                        />
                        {startDate && (
                            <p className="text-white/30 text-xs mt-2">
                                Season: {(() => {
                                    const month = new Date(startDate).getMonth()
                                    if (month >= 2 && month <= 4) return '🌸 Spring'
                                    if (month >= 5 && month <= 7) return '☀️ Summer'
                                    if (month >= 8 && month <= 10) return '🍂 Autumn'
                                    return '❄️ Winter'
                                })()}
                                - activities will be tailored to this season
                            </p>
                        )}
                    </div>

                    {/* Budget */}
                    <div className="glass p-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <FiDollarSign className="text-accent-400" /> Budget
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {BUDGET_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setBudget(opt.value)}
                                    className={`p-3 rounded-xl border text-center transition-all
                                        ${budget === opt.value
                                            ? 'border-primary-500 bg-primary-500/20 text-white'
                                            : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="font-medium text-sm">{opt.label}</div>
                                    <div className="text-xs mt-1 opacity-60">{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Travel Style */}
                    <div className="glass p-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <FiCompass className="text-accent-400" /> Travel Style
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                            {STYLE_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setTravelStyle(opt.value)}
                                    className={`p-3 rounded-xl border text-left transition-all 
                                        ${travelStyle === opt.value
                                            ? 'border-primary-500 bg-primary-500/20 text-white'
                                            : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
                                        }`}
                                >
                                    <div className="font-medium text-sm">{opt.label}</div>
                                    <div className="text-xs mt-1 opacity-60">{opt.desc}</div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Interests */}
                    <div className="glass p-6">
                        <label className="flex items-center gap-2 text-sm font-medium text-white/70 mb-3">
                            <FiHeart className="text-accent-400" /> Special Interests (optional)
                        </label>
                        <textarea
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4
                            text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50
                            focus:ring-1 focus:ring-primary-500/50 transition-all resize-none"
                            rows={3}
                            placeholder="e.g. street photography, local markets, hidden gems"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full gradient-primary text-white font-semibold py-4 px-6
                        rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity
                        text-lg"
                    >
                        <FiSend size={20} />
                        Generate Itinerary with AI
                    </button>
                </form>
            </div>
        </PageWrapper>
    )
}