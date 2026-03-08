const API_URL = import.meta.env.VITE_API_URL

export async function getPhoto(query) {

    try {
        const response = await fetch(
            `${API_URL}/api/photo?query=${encodeURIComponent(query)}`
        )

        if (!response.ok) return null

        const data = await response.json()
        return {
            url: data.url,
            smallUrl: data.small_url,
            alt: data.alt,
            credit: {
                name: data.credit_name,
                link: data.credit_link,
            },
        }
    } catch {
        return null
    }
}