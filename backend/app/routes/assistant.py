from fastapi import APIRouter, HTTPException
from app.models import ChatMessage
from app.database import get_supabase
import google.generativeai as genai
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

SYSTEM_PROMPT = """You are a helpful AI assistant for SchemeFinder AI, a platform that helps Indian citizens discover government schemes they may be eligible for.

Your role:
- Answer questions about Indian government schemes clearly and accurately
- Use ONLY the scheme data provided to you as context
- Provide practical guidance on eligibility, documents, and application procedures
- Always include official website links where relevant
- Use simple English that is easy for all citizens to understand
- If a question is about a scheme not in the database, say so clearly

Important rules:
- Do NOT invent schemes, benefits, or eligibility criteria not in the provided data
- Do NOT provide incorrect official links
- If you are unsure about something, say "I'm not sure about this. Please verify at the official scheme website."
- Always end with a reminder that final eligibility is determined by the relevant government department

Format your responses with:
- Clear headings for different schemes
- Bullet points for eligibility criteria and documents
- Bold text for important information
- Official links clearly marked
"""


def build_schemes_context(schemes: list) -> str:
    """Build a context string from all schemes for the AI."""
    if not schemes:
        return "No schemes available in database."

    context = "GOVERNMENT SCHEMES DATABASE:\n\n"
    for scheme in schemes:
        context += f"**{scheme['name']}** (Category: {scheme['category']})\n"
        context += f"Description: {scheme['description']}\n"
        context += f"Benefits: {scheme['benefits']}\n"
        context += f"Eligibility: Age {scheme['min_age']}-{scheme['max_age']}, "
        if scheme['max_annual_income'] < 9999999999:
            context += f"Income up to ₹{scheme['max_annual_income']:,}, "
        occupations = scheme.get('eligible_occupations', ['all'])
        if 'all' not in [o.lower() for o in occupations]:
            context += f"Occupations: {', '.join(occupations)}, "
        context += "\n"
        context += f"Documents: {', '.join(scheme.get('documents_required', []))}\n"
        context += f"Application: {scheme['application_procedure']}\n"
        context += f"Official Website: {scheme['official_url']}\n\n"
        context += "---\n"

    return context


@router.post("/chat")
def chat_with_assistant(message: ChatMessage):
    """Chat with the AI assistant about government schemes."""

    # Check if Gemini API key is configured
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail=(
                "Gemini API key is not configured. "
                "Add GEMINI_API_KEY to your backend/.env file. "
                "Get a free key at https://aistudio.google.com/"
            )
        )

    try:
        # Fetch all schemes for context
        try:
            db = get_supabase()
            result = db.table("schemes").select("*").eq("is_active", True).execute()
            schemes = result.data
        except RuntimeError:
            schemes = []

        # Build context
        schemes_context = build_schemes_context(schemes)

        # Build user context if profile provided
        profile_context = ""
        if message.user_profile:
            p = message.user_profile
            profile_context = f"""
USER PROFILE:
- Age: {p.age} years
- State: {p.state}
- Occupation: {p.occupation}
- Annual Income: ₹{p.annual_income:,}
- Education: {p.education}
"""

        # Configure Gemini
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(
            model_name="gemini-1.5-flash",
            system_instruction=SYSTEM_PROMPT
        )

        # Build full prompt
        full_prompt = f"""
{schemes_context}

{profile_context}

USER QUESTION: {message.message}

Please answer based on the scheme data above. Include official links where relevant.
"""

        # Generate response
        response = model.generate_content(full_prompt)
        ai_response = response.text

        # Extract source links
        sources = list(set(
            scheme["official_url"] for scheme in schemes
            if scheme["name"].lower() in ai_response.lower()
        ))[:5]

        session_id = message.session_id or str(uuid.uuid4())

        # Log conversation (best effort - ignore failures)
        try:
            db = get_supabase()
            db.table("chat_sessions").insert({
                "session_id": session_id,
                "user_message": message.message,
                "assistant_response": ai_response
            }).execute()
        except Exception:
            pass  # Logging is non-critical

        return {
            "response": ai_response,
            "sources": sources,
            "session_id": session_id
        }

    except HTTPException:
        raise
    except Exception as e:
        error_msg = str(e)
        if "API_KEY" in error_msg.upper() or "api key" in error_msg.lower():
            raise HTTPException(
                status_code=503,
                detail="Invalid Gemini API key. Please check your GEMINI_API_KEY in backend/.env"
            )
        raise HTTPException(status_code=500, detail=f"AI assistant error: {error_msg}")
