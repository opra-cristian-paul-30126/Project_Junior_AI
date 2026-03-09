import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTrips } from '../hooks/useTrips'
import { usePhoto } from '../hooks/usePhoto'
import PageWrapper from '../components/layout/PageWrapper'
import {
    FiPlusCircle, FiMapPin, FiCalendar, FiArrowRight,
    FiDollarSign, FiCompass, FiZap, FiEdit, FiCloud
}
    from 'react-icons/fi'


// Mini trip card with photo for dashboard
function DashboardTripCard({ trip }) {
    const { data: photo } = usePhoto(trip.destination)

    return (
        <Link
            to={`/itinerary/${trip.id}`}
            className="glass overflow-hidden group hover:bg-white/10 transition-all"
        >
            {/* Photo */}
            <div className="h-32 relative overflow-hidden">
                {photo ? (
                    <>
                        <img
                            src={photo.smallUrl}
                            alt={photo.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-900/50 to-accent-500/20 flex items-center justify-center">
                        <span className="text-4xl">🌍</span>
                    </div>
                )}
                {/* Destination overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-3">
                    <div className="flex items-center gap-1.5">
                        <FiMapPin className="text-accent-400" size={14} />
                        <h3 className="font-bold text-white text-sm truncate">{trip.destination}</h3>
                    </div>
                </div>
            </div>

            {/* Info */}
            <div className="p-3">
                <div className="flex items-center gap-3 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                        <FiCalendar size={12} /> {trip.days} days
                    </span>
                    <span className="capitalize px-1.5 py-0.5 bg-white/10 rounded-full">
                        {trip.budget}
                    </span>
                    <span className="flex items-center gap-1 capitalize">
                        <FiCompass size={12} /> {trip.travel_style}
                    </span>
                </div>
            </div>
        </Link>
    )
}


export default function DashboardPage() {
    const { user } = useAuth()
    const { data: trips, isLoading } = useTrips()

    const recentTrips = trips?.slice(0, 3) || []
    const totalTrips = trips?.length || 0
    const totalDays = trips?.reduce((sum, t) => sum + t.days, 0) || 0
    const destinations = [...new Set(trips?.map(t => t.destination) || [])].length

    return (
        <PageWrapper>
            {/* Hero Section */}
            <div className="text-center py-12 animate-fade-in">
                <p className="text-white/40 text-sm mb-2">
                    Welcome back, {user?.email?.split('@')[0]} 👋
                </p>
                <h1 className="text-5xl font-extrabold mb-4">
                    <span className="bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">
                        Where to next?
                    </span>
                </h1>
                <p className="text-white/50 text-lg max-w-2xl mx-auto mb-8">
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

            {/* Stats Row */}
            {totalTrips > 0 && (
                <div className="grid grid-cols-3 gap-4 mb-12 animate-fade-in">
                    <div className="glass p-4 text-center">
                        <p className="text-3xl font-bold bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">{totalTrips}</p>
                        <p className="text-white/40 text-sm">Trips Planned</p>
                    </div>
                    <div className="glass p-4 text-center">
                        <p className="text-3xl font-bold bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">{totalDays}</p>
                        <p className="text-white/40 text-sm">Days of Adventure</p>
                    </div>
                    <div className="glass p-4 text-center">
                        <p className="text-3xl font-bold bg-linear-to-r from-primary-500 to-accent-500 bg-clip-text text-transparent">{destinations}</p>
                        <p className="text-white/40 text-sm">Destinations</p>
                    </div>
                </div>
            )}

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
                {[
                    {
                        icon: <FiZap className="text-primary-400" size={28} />,
                        title: 'AI-Powered',
                        desc: 'Gemini AI generates detailed day-by-day itineraries tailored to your style',
                    },
                    {
                        icon: <FiEdit className="text-accent-400" size={28} />,
                        title: 'Smart Editing',
                        desc: 'Tell the AI what to change and it modifies only what you ask — no full regeneration needed',
                    },
                    {
                        icon: <FiCloud className="text-primary-400" size={28} />,
                        title: 'Save & Revisit',
                        desc: 'All your trips are saved to your account — access them anytime',
                    },
                ].map((feature) => (
                    <div key={feature.title} className="glass p-6 text-center animate-slide-up hover:bg-white/5 transition-all">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                            {feature.icon}
                        </div>
                        <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                        <p className="text-white/40 text-sm">{feature.desc}</p>
                    </div>
                ))}
            </div>


            {/* Recent Trips */}
            {!isLoading && recentTrips.length > 0 && (
                <div className="animate-fade-in">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-white">Recent Trips</h2>
                        <Link
                            to="/my-trips"
                            className="text-primary-400 hover:text-primary-300 flex items-center gap-1
                            transition-colors text-sm"
                        >
                            View all <FiArrowRight size={14} />
                        </Link>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                        {recentTrips.map((trip) => (
                            <DashboardTripCard key={trip.id} trip={trip} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty state for new users */}
            {!isLoading && totalTrips === 0 && (
                <div className="glass p-12 text-center animate-fade-in">
                    <span className="text-5xl mb-4 block">✈️</span>
                    <h3 className="text-xl font-bold text-white mb-2">No trips yet!</h3>
                    <p className="text-white/40 mb-6">Plan your first adventure — it only takes a minute.</p>
                    <Link
                        to="/new-trip"
                        className="inline-flex items-center gap-2 gradient-primary text-white font-medium py-2 px-6 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <FiPlusCircle size={18} />
                        Get Started
                    </Link>
                </div>
            )}

        </PageWrapper>
    )
}