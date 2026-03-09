# Itinerary Generator

The project is a travel planning web application that generates personalized, day-by-day itineraries based on user preferences. Tell the app your destination, budget, travel style, and duration, and it will build a complete schedule for you.

## What it does
*   **Generates Itineraries**: Uses AI to create structured daily schedules with activities, times, and descriptions.
*   **Editing**: Users can provide natural language feedback (e.g., "make it more kid-friendly" or "swap museums for parks") and the AI will modify the existing itinerary without losing the overall structure. Or you can regenerate all of it if you don't like it.
*   **Destination Imagery**: Automatically fetches destination photos to enhance the visual experience.
*   **Saved Trips**: Users can create an account to save, view, and manage all their past and upcoming trips in a personalized dashboard.

## Tools and LLMs Used
*   **Frontend**: React (Vite), Tailwind CSS, React Router, React Query
*   **Backend**: Python, FastAPI
*   **AI Integration**: Google Gemini (`gemini-2.5-flash`) for intelligent itinerary generation and modification, and Claude for suggestions, code implementation, and debugging.
*   **External APIs**: Unsplash API for destination imagery.
*   **Database & Auth**: Supabase (PostgreSQL + Authentication)
*   **Deployment tools**: Docker and Docker Compose for containerized building and hosting.

## Technical Hurdle
**(Hallucination):** During the initial development of the itinerary generation, users could type anything into the "Interests" text area. The AI would attempt to incorporate these interests aggressively that it would begin "hallucinating" activities that didn't exist in the destination city. For example, if a user put a highly specific event like a concert, or festival, the Gemini model would sometimes invent the fake event or attraction with a location so that it would match the interest, rather than finding a real-world equivalent.

**How I solved it**
To solve this, I added new rules to restructure the system prompt being sent to Gemini.
Instead of just asking it to *"include activities related to these interests"*, we added strict geographical and factual constraints to the prompt:

> *"- For "location", ALWAYS provide a SPECIFIC real place name with address or neighborhood. NEVER use generic descriptions"*
> *"- For user interests: ONLY incorporate if realistic and verifiable. If user mentions unverifiable events, suggest similar alternatives instead. NEVER invent events."*

By explicitly defining the boundaries of the model's creativity and forcing it to anchor its suggestions to factual, verifiable locations, we eliminated the hallucinated itinerary items while still maintaining a highly personalized output.
