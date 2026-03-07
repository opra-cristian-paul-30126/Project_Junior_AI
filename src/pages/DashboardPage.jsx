import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../hooks/useTrips'
import PageWrapper from '../components/layout/PageWrapper'
import { FiPlusCircle, FiMapPin, FiCalendar, FiArrowRight } from 'react-icons/fi'

export default function DashboardPage() {
    const { user } = useAuth()
    const { data: trips, isLoading } = useTrips()

    const recentTrips = trips?.slice(0, 3) || []

    return (
        <PageWrapper>
            {/* Hero Section */}
            <div className="text-center py-16 animate-fade-in">
                <h1 className="text-5xl font-extrabold mb-4">
                    <span className="bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                        Where to next?
                    </span>
                </h1>
                <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
                    Let AI craft your perfect travel itinerary. Just tell us where you want to go,
                    and TripMind will plan every detail for you.
                </p>
                <Link
                    to="/new-trip"
                    className="inline-flex items-center gap-2 gradient-primary text-white font-semibold
                    py-3 px-8 rounded-xl hover:opacity-90 transition-opacity text-lg"
                >
                    <FiPlusCircle size={22} />
                    Plan a New Trip
                </Link>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-16">
                {[
                    {
                        icon: '🤖',
                        title: 'AI-Powered',
                        desc: 'Gemini AI generates detailed day-by-day itineraries tailored to you style',
                    },
                    {
                        icon: '',
                        title: 'Fully Editable',
                        desc: 'Customize any activity, reorder your days, and make the trip yours',
                    },
                    {
                        icon: '',
                        title: 'Save & Revisit',
                        desc: 'All your trips are saved to your account - access them anytime',
                    },
                ].map((feature) => (
                    <div key={feature.title} className="glass p-6 text-center animate-slide-up">
                        <div className="text-4xl mb-4">{feature.icon}</div>
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-white/50 text-sm">{feature.desc}</p>
                    </div>
                ))}
            </div>


            {/* Recent Trips */}
            {!isLoading && recentTrips.length > 0 && (
                <div className="animate-fade-in">
                    <div classname="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Recent Trips</h2>
                        <Link
                            to="/my-trips"
                            className="text-primary-400 hover:text-primary-300 flex items-center gap-1
                            transition-colors"
                        >
                            View all <FiArrowRight />
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {recentTrips.map((trip) => (
                            <Link
                                key={trip.id}
                                to={`/itinerary/${trip.id}`}
                                className="glass p-5 hover:bg-white/10 transition-all group"
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <FiMapPin className="text-accent-400" />
                                    <h3 className="font-semibold text-white group-hover:text-primary-400
                                    transition-colors">
                                        {trip.destination}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-white/40">
                                    <span className="flex items-center gap-1">
                                        <FiCalendar size={14} />
                                    </span>
                                    <span className="capitalize px-2 py-0.5 bg-white/10 rounded-full text-xs">
                                        {trip.budget}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </PageWrapper>
    )
}