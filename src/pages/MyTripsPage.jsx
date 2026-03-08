import { Link, useNavigate } from 'react-router-dom'
import { useTrips, useDeleteTrip } from '../hooks/useTrips'
import { usePhoto } from '../hooks/usePhoto'
import PageWrapper from '../components/layout/PageWrapper'
import toast from 'react-hot-toast'
import { FiMapPin, FiCalendar, FiDollarSign, FiCompass, FiTrash2, FiEye, FiPlusCircle } from 'react-icons/fi'

function TripCard({ trip, onDelete }) {
    const { data: photo } = usePhoto(trip.destination)

    return (
        <div className="glass overflow-hidden group hover:bg-white/10 transition-all flex flex-col h-full">
            {/* Photo header */}
            <div className="h-40 relative overflow-hidden">
                {photo ? (
                    <>
                        <img
                            src={photo.smallUrl}
                            alt={photo.alt}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform
                            duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 to-transparent" />
                        <p className="absolute bottom-2 right-2 text-white/20 text-xs">
                            📷 <a href={photo.credit.link} target="_blank" rel="noopener noreferrer"
                                className="hover:text-white/40">{photo.credit.name}</a>
                        </p>
                    </>
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-900/50 to-accent-500/20
                    flex items-center justify-center">
                        <span className="text-5xl">🌍</span>
                    </div>
                )}
            </div>

            {/* Card body */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 mb-2">
                    <FiMapPin className="text-accent-400" />
                    <h3 className="font-bold text-white text-lg">{trip.destination}</h3>
                </div>
                <div className="flex flex-wrap gap-3 mb-3 text-sm text-white/40">
                    <span className="flex items-center gap-1">
                        <FiCalendar size={14} /> {trip.days} days
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
                    {trip.start_date && (
                        <p className="text-white/40 text-xs mb-1">
                            📅 {new Date(trip.start_date).toLocaleDateString('en-US', {
                                month: 'long', day: 'numeric', year: 'numeric'
                            })}
                        </p>
                    )}
                    Created {new Date(trip.created_at).toLocaleDateString()}
                </p>
                <div className="flex gap-2 mt-auto">
                    <Link
                        to={`/itinerary/${trip.id}`}
                        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-primary-500/20 text-primary-400 hover:bg-primary-500/30 transition-all text-sm font-medium"
                    >
                        <FiEye size={16} /> View
                    </Link>
                    <button
                        onClick={() => onDelete(trip.id, trip.destination)}
                        className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg bg-red-500/10 text-red-400/70 hover:bg-red-500/20 hover:text-red-400 transition-all text-sm"
                    >
                        <FiTrash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}


export default function MyTripsPage() {
    const { data: trips, isLoading } = useTrips()
    const deleteTrip = useDeleteTrip()
    const navigate = useNavigate()

    const handleDelete = (tripId, destination) => {
        if (!confirm(`Delete your trip to ${destination}? This cannot be undone.`)) return
        deleteTrip.mutate(tripId, {
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
                            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </PageWrapper>
    )
}