import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTrips, getTripById, createTrip, deleteTrip } from '../services/tripService'

export function useTrips() {
    return useQuery({
        queryKey: ['trips'],
        queryFn: getTrips,
    })
}

export function useTrip(id) {
    return useQuery({
        queryKey: ['trip', id],
        queryFn: () => getTripById(id),
        enabled: !!id, //don't fetch if id is undefined
    })
}

export function useCreateTrip() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: createTrip,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trips'] })
        },
    })
}

export function useDeleteTrip() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: deleteTrip,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['trips'] })
        },
    })
}