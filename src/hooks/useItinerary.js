import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getItinerary, updateActivity, deleteActivity } from '../services/itineraryServices'

export function useItinerary(tripId) {
    return useQuery({
        queryKey: ['itinerary', tripId],
        queryFn: () => getItinerary(tripId),
        enabled: !!tripId,
    })
}

export function useUpdateActivity() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ activityId, updates }) => updateActivity(activityId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itinerary'] })
        },
    })
}

export function useDeleteActivity() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteActivity,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['itinerary'] })
        },
    })
}