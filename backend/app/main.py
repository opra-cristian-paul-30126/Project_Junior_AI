from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.itinerary import router as itinerary_router

app = FastAPI(
    title="TripMind API",
    description="AI-powered travel itinerary generator",
    version="1.0.0",
)

#CORS - allow the React frontend to call the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost"], # Vite dev server and Docker Nginx
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(itinerary_router)

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "TripMind API"}