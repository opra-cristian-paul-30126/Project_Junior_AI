import os
import json
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-2.5-flash')

def build_prompt(destination, days, budget, travel_style, interests=None, start_date=None):
    date_context = ""
    if start_date:
        from datetime import datetime
        parsed = datetime.strptime(start_date, "%Y-%m-%d")
        month_name = parsed.strftime("%B %d, %Y")
        date_context = f"""
    - Travel dates: Starting {month_name}
    - Suggest activities appropriate for this time of year. Consider weather, seasonal events, and festivals."""

    return f"""You are an expert travel planner. Create a detailed {days}-day travel itinerary for {destination}.

    Travel preferences:
    - Budget level: {budget}
    - Travel style: {travel_style}
    - Special interests: {interests or 'general sightseeing'}{date_context}

    IMPORTANT: Respond ONLY with valid JSON in this exact format, no markdown, no explanation:
    {{
        "trip_title": "A short catchy title for the trip",
        "days": [
            {{
                "day_number": 1,
                "title": "Day title",
                "description": "Brief overview",
                "activities": [
                    {{
                        "time_of_day": "morning",
                        "name": "Activity name",
                        "location": "Specific real place with address",
                        "notes": "Practical tips (2-3 sentences)",
                        "type": "culture"
                    }}
                ]
            }}
        ]
    }}

    Rules:
        - Each day MUST have exactly 3 activities: one for morning, one for afternoon, one for evening
        - time_of_day must be one of: "morning", "afternoon", "evening"
        - type must be one of: "food", "culture", "outdoor", "shopping", "nightlife"
        - For "location", ALWAYS provide a SPECIFIC real place name with address or neighborhood. NEVER use generic descriptions
        - Include practical tips in notes: estimated costs, opening hours, booking advice
        - Tailor activities to the {budget} budget level and {travel_style} travel style
        - For user interests: ONLY incorporate if realistic and verifiable. If user mentions unverifiable events, suggest similar alternatives instead. NEVER invent events.
        - Return ONLY the JSON object, nothing else
    """

def generate_itinerary(destination, days, budget, travel_style, interests=None, start_date=None):
    prompt = build_prompt(destination, days, budget, travel_style, interests, start_date)

    response = model.generate_content(prompt)
    text = response.text

    # Clean markdown wrappers
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    if text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()

    itinerary = json.loads(text)

    # Validate structure
    if not itinerary.get("trip_title") or not isinstance(itinerary.get("days"), list):
        raise ValueError("Invalid itinerary structure from Gemini")
    
    return itinerary