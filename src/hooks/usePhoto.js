import { useQuery } from '@tanstack/react-query'
import { getPhoto } from '../services/unsplash'

export function usePhoto(query) {
    return useQuery({
        queryKey: ['photo', query],
        queryFn: () => getPhoto(query),
        enabled: !!query,
        staleTime: 1000 * 60 * 60, // cache for 1 hour
        retry: false,
    })
}