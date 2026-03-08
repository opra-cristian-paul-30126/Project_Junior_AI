const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY

export async function getPhoto(query) {
    if (!UNSPLASH_ACCESS_KEY) return null

    try {
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
            {
                headers: {
                    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
                },
            }
        )

        const data = await response.json()

        if (data.results && data.results.length > 0) {
            return {
                url: data.results[0].urls.regular,
                smallUrl: data.results[0].urls.small,
                alt: data.results[0].alt_description || query,
                credit: {
                    name: data.results[0].user.name,
                    link: data.results[0].user.links.html,
                },
            }
        }
        return null
    } catch (error) {
        console.error('Unsplash fetch failed: ', error)
        return null
    }
}