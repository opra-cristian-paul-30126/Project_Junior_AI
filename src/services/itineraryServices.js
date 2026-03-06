import { supabase } from '../lib/supabase'

export async function saveItinerary(tripId, days) {
    //Save each day and its activities
    for (const day of days) {
        // 1. Insert the day
        const { data: dayData, error: dayError } = await supabase
            .from('itinerary_days')
            .insert({
                trip_id: tripId,
                day_number: day.day_number,
                title: day.title,
                description: day.description || '',
            })
            .select()
            .single()

        if (dayError) throw dayError

        // 2. Insert all activities for this day
        const activities = day.activities.map((activity) => ({
            day_id: dayData.id,
            time_of_day: activity.time_of_day,
            name: activity.name,
            location: activity.location || '',
            notes: activity.notes || '',
            type: activity.type,
        }))

        const { error: actError } = await supabase
            .from('activities')
            .insert(activities)

        if (actError) throw actError
    }
}

export async function getItinerary(tripId) {
    // Fetch days with their activities in one query
    const { data: days, error } = await supabase
        .from('itinerary_days')
        .select(`
            *,
            activities (*)
        `)
        .eq('trip_id', tripId)
        .order('day_number', { ascending: true })

    if (error) throw error

    // Sort activities within each day by time_of_day
    const timeOrder = { morning: 1, afternoon: 2, evening: 3 }
    return days.map((day) => ({
        ...day,
        activities: day.activities.sort(
            (a, b) => timeOrder[a.time_of_day] - timeOrder[b.time_of_day]
        ),
    }))
}


export async function updateActivity(activityId, updates) {
    const { data, error } = await supabase
        .from('activities')
        .update(updates)
        .eq('id', activityId)
        .select()
        .single()

    if (error) throw error
    return data
}

export async function deleteActivity(activityId) {
    const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', activityId)

    if (error) throw error
}