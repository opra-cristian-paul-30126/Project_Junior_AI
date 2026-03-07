import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useTrip } from '../hooks/useTrips'
import { useItinerary, useUpdateActivity, useDeleteActivity } from '../hooks/useItinerary'
import PageWrapper from '../components/layout/PageWrapper'
import toast from 'react-hot-toast'
import {
    FiMapPin, FiCalendar, FiDollarSign, FiCompass, FiClock,
    FiEdit3, FiTrash2, FiCheck, FiX, FiArrowLeft,
    FiSun, FiSunset, FiMoon
} from 'react-icons/fi'

const TYPE_ICONS = {
    food: '🍜',
    culture: '🏛️',
    outdoor: '🏔️',
    shopping: '🛍️',
    nightlife: '🌙',
}


const TIME_CONFIG = {
    morning: { icon: FiSun, label: 'Morning', color: 'text-amber-400' },
    afternoon: { icon: FiSunset, label: 'Afternoon', color: 'text-orange-400' },
    evening: { icon: FiMoon, label: 'Evening', color: 'text-indigo-400' },
}

function ActivityCard({ activity }) {
    const [editing, setEditing] = useState(false)
    const [notes, setNotes] = useState(activity.notes || '')
    const updateActivity = useUpdateActivity()
    const deleteActivity = useDeleteActivity()

    const timeConfig = TIME_CONFIG[activity.time_of_day]
    const TimeIcon = timeConfig.icon

    const handleSave = () => {
        updateActivity.mutate(
            { activityId: activity.id, updates: { notes } },
            {
                onSuccess: () => {
                    toast.success('Activity updated!')
                    setEditing(false)
                },
                onError: (err) => toast.error(err.message),
            }
        )
    }

    const handleDelete = () => {
        if (!confirm('Delete this activity?')) return
        deleteActivity.mutate(activity.id, {
            onSuccess: () => toast.success('Activity deleted'),
            onError: (err) => toast.error(err.message),
        })
    }

    return (
        <div className="glass p-5 hover:bg-white/10 transition-all group">
            <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                    {/* Time & Type badges */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`flex items-center gap-1 text-xs font medium ${timeConfig.color}`}>
                            <TimeIcon size={14} />
                            {timeConfig.label}
                        </span>
                        <span className="text-lg">{TYPE_ICONS[activity.type]}</span>
                        <span className="text-xs text-white/30 capitalize px-2 py-0.5 bg-white/5 rounded-full">
                            {activity.type}
                        </span>
                    </div>

                    {/* Activity name & location */}
                    <h4 className="font-semibold text-white text-lg">{activity.name}</h4>
                    {activity.location && (
                        <p className="text-white/40 text-sm flex items-center gap-1 mt-1">
                            <FiMapPin size={12} /> {activity.location}
                        </p>
                    )}

                    {/* Notes - editable */}
                    {editing ? (
                        <div className="mt-3">
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="w-full bg-white/5 border border-white/20 rounded-lg py-2 px-3
                                text-white text-sm focus:outline-none focus:border-primary-500/50 resize-none"
                                rows={3}
                            />
                            <div className="flex gap-2 mt-2">
                                <button onClick={handleSave} className="flex items-center gap-1 text-xs text-green-400
                                hover:text-green-300">
                                    <FiCheck size={14} /> Save
                                </button>
                                <button onClick={() => { setEditing(false); setNotes(activity.notes || '') }} className="flex
                                items-center gap-1 text-xs text-white/40 hover:text-white/60">
                                    <FiX size={14} /> Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        activity.notes && (
                            <p className="text-white/50 text-sm mt-2 leading-relaxed">{activity.notes}</p>
                        )
                    )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setEditing(true)} className="p-2 hover:bg-white/10 rounded-lg text-white/40
                    hover:text-primary-400 transition-all">
                        <FiEdit3 size={16} />
                    </button>
                    <button onClick={handleDelete} className="p-2 hover:bg-red-500/10 rounded-lg text-white/40
                    hover:text-red-400 transition-all">
                        <FiTrash2 size={16} />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function ItineraryPage() {
    const { id } = useParams()
    const { data: trip, isLoading: tripLoading } = useTrip(id)
    const { data: days, isLoading: daysLoading } = useItinerary(id)
    const [activeDay, setActiveDay] = useState(0)

    if (tripLoading || daysLoading) {
        return (
            <PageWrapper>
                <div className="flex items-center justify-center py-32">
                    <div className="w-12 h-12 rounded-full border-4 border-white/10 border-t-primary-400 animate-spin" />
                </div>
            </PageWrapper>
        )
    }

    if (!trip) {
        return (
            <PageWrapper>
                <div className="text-center py-32">
                    <h2 className="text-2xl font-bold text-white mb-4">Trip not found</h2>
                    <Link to="/" className="text-primary-400 hover:text-primary-300">Back to Dashboard</Link>
                </div>
            </PageWrapper>
        )
    }

    const currentDay = days?.[activeDay]

    return (
        <PageWrapper>
            <div className="animate-fade-in">
                {/* Back button + Trip Header */}
                <Link to="/my-trips" className="inline-flex items-center gap-1 text-white/40 hover:text-white/70 transition-colors mb-6">
                    <FiArrowLeft size={16} /> Back to My Trips
                </Link>

                <div className="glass p-6 mb-8">
                    <h1 className="text-3xl font-bold text-white mb-3">
                        <FiMapPin className="inline text-accent-400 mr-2" />
                        {trip.destination}
                    </h1>
                    <div className="flex flex-wrap gap-4 text-sm text-white/50">
                        <span className="flex items-center gap-1">
                            <FiCalendar size={14} /> {trip.days} days
                        </span>
                        <span className="flex items-center gap-1">
                            <FiDollarSign size={14} /> <span className="capitalize">{trip.travel_style}</span>
                        </span>
                    </div>
                </div>

                {/* Day Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {days?.map((day, index) => (
                        <button
                            key={day.id}
                            onClick={() => setActiveDay(index)}
                            className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all
                                ${activeDay === index
                                    ? 'gradient-primary text-white'
                                    : 'glass text-white/50 hover:text-white'
                                }`}
                        >
                            Day {day.day_number}
                        </button>
                    ))}
                </div>

                {/* Current Day Content */}
                {currentDay && (
                    <div className="animate-fade-in">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white">{currentDay.title}</h2>
                            {currentDay.description && (
                                <p className="text-white/60 mt-2">{currentDay.description}</p>
                            )}
                        </div>

                        <div className="space-y-4">
                            {currentDay.activities?.map((activity) => (
                                <ActivityCard key={activity.id} activity={activity} />
                            ))}
                            {(!currentDay.activities || currentDay.activities.length === 0) && (
                                <p className="text-white/30 text-center py-8">No activities for this day</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </PageWrapper>
    )

}