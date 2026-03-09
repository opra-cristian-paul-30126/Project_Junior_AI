from fastapi import APIRouter, HTTPException
from app.schemas import TripRequest, ItineraryResponse, PhotoResponse, ModifyRequest
from app.services.gemini_service import generate_itinerary, modify_itinerary
from app.services.unsplash_service import get_photos

router = APIRouter(prefix="/api", tags=["itinerary"])

@router.post("/generate-itinerary", response_model=ItineraryResponse)
async def create_itinerary(trip: TripRequest):
    try:
        itinerary = generate_itinerary(
            destination=trip.destination,
            days=trip.days,
            budget=trip.budget,
            travel_style=trip.travel_style,
            interests=trip.interests,
            start_date=trip.start_date,
        )
        return itinerary
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate itinerary: {str(e)}")
    

@router.get("/photo")
async def fetch_photo(query: str):
    photo = await get_photos(query)
    if not photo:
        raise HTTPException(status_code=404, detail="No photo found")
    return photo


@router.post("/modify-itinerary", response_model=ItineraryResponse)
async def update_itinerary(data: ModifyRequest):
    try:
        current = data.current_itinerary.model_dump()
        itinerary = modify_itinerary(current, data.feedback, data.destination)
        return itinerary
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to modify itinerary: {str(e)}")