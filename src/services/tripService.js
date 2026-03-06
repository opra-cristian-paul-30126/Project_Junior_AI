import { supabase } from '../lib/supabase'

export async function createTrip({ destination, days, budget, travelStyle }) {
    const { data: { user } } = await supabase.auth.getUser()

    const { data, error } = await supabase
        .from('trips')
        .insert({
            user_id: user.id,
            destination,
            days,
            budget,
            travel_style: travelStyle,
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getTrips() {
    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) throw error
    return data
}

export async function getTripById(id) {
    const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}

export async function deleteTrip(id) {
    const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id)

    if (error) throw error
}