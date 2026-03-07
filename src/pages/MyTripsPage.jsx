import { Link, useNavigate } from 'react-router-dom'
import { useTrips, useDeleteTrip } from '../hooks/useTrips'
import PageWrapper from '../components/layout/PageWrapper'
import toast from 'react-hot-toast'
import { FiMapPin, FiCalendar, FiDollarSign, FiCompass, FiTrash2, FiEye, FiPlusCircle } from 'react-icons/fi'

export default function MyTripsPage() {
    const { data: trips, isLoading } = useTrips()
    const deleteTrip = useDeleteTrip()
    const navigate = useNavigate()

    const handleDelete = (tripId, destination) => {
        if (!confirm(`Delete your trip to ${destination}? This cannot be undone.`))
            return deleteTrip.mutate(tripId, {
                onSuccess: () => toast.success('Trip deleted'),
                onError: (err) => toast.error(err.message),
            })
    }

    if (isLoading) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center py-32">
                    <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary-400 animate-spin" />
                </div>
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">My Trips</h1>
                        <p className="text-white/50 mt-1">{trips?.length || 0} trips planned</p>
                    </div>
                    <Link
                        to="/new-trip"
                        className="inline-flex items-center gap-2 gradient-primary text-white font-semibold
                        py-2.5 px-5 rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <FiPlusCircle size={18} />
                        New Trip
                    </Link>
                </div>

                {trips?.length === 0 ? (
                    <div className="text-center py-24">
                        <div className="text-6xl mb-6">🗺️</div>
                        <h2 className="text-2xl font-bold text-white mb-2">No trips yet</h2>
                        <p className="text-white/50 mb-8">Plan your first AI-powered adventure!</p>
                        <Link
                            to="/new-trip"
                            className="inline-flex items-center gap-2 gradient-primary text-white font-semibold
                            py-3 px-6 rounded-xl hover:opacity-90 transition-opacity"
                        >
                            <FiPlusCircle size={18} />
                            Plan a Trip
                        </Link>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {trips.map((trip) => (
                            <div key={trip.id} className="glass p-6 group hover:bg-white/10 transition-all">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <FiMapPin className="text-accent-400" />
                                        <h3 className="font-bold text-white text-lg">{trip.destination}</h3>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3 mb-4 text-sm text-white/40">
                                    <span className="flex items-center gap-1">
                                        <FiCalendar size={14} /> {trip.days} Days
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiDollarSign size={14} />
                                        <span className="capitalize">{trip.budget}</span>
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FiCompass size={14} />
                                        <span className="capitalize">{trip.travel_style}</span>
                                    </span>
                                </div>

                                <p className="text-white/30 text-xs mb-4">
                                    Created {new Date(trip.created_at).toLocaleDateString()}
                                </p>

                                <div className="flex gap-2">
                                    <Link
                                        to={`/itinerary/${trip.id}`}
                                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-500/20
                                    text-primary-400 hover:bg-primary-500/30 transition-all text-sm font-medium"
                                    >
                                        <FiEye size={16} /> View
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(trip.id, trip.destination)}
                                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10
                                    text-red-400/70 hover:bg-red-500/20 hover:text-red-400 transition-all text-sm"
                                    >
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    )
}