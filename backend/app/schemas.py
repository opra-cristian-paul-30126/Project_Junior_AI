from pydantic import BaseModel, Field
from typing import Optional

class TripRequest(BaseModel):
    destination: str
    days: int = Field(gt=0, le=30)
    budget: str
    travel_style: str
    interests: Optional[str] = None
    start_date: Optional[str] = None

class Activity(BaseModel):
    time_of_day: str
    name: str
    location: Optional[str] = None
    notes: Optional[str] = None
    type: str

class Day(BaseModel):
    day_number: int
    title: str
    description: Optional[str] = None
    activities: list[Activity]

class ItineraryResponse(BaseModel):
    trip_title: str
    days: list[Day]

class PhotoResponse(BaseModel):
    url: str
    small_url: str
    alt: str
    credit_name: str
    credit_link: str