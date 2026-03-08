import os
import httpx
from dotenv import load_dotenv

load_dotenv()

UNSPLASH_ACCESS_KEY = os.getenv("UNSPLASH_ACCESS_KEY")

async def get_photos(query: str):
    if not UNSPLASH_ACCESS_KEY:
        return None
    
    async with httpx.AsyncClient() as client:
        response = await client.get(
            "https://api.unsplash.com/search/photos",
            params={"query": query, "per_page": 1, "orientation": "landscape"},
            headers={"Authorization": f"Client-ID {UNSPLASH_ACCESS_KEY}"},
        )
    
    if response.status_code != 200:
        return None
    
    data = response.json()
    results = data.get("results", [])

    if not results:
        return None
    
    photo = results[0]
    return {
        "url": photo["urls"]["regular"],
        "small_url": photo["urls"]["small"],
        "alt": photo.get("alt_description", query),
        "credit_name": photo["user"]["name"],
        "credit_link": photo["user"]["links"]["html"],
    }