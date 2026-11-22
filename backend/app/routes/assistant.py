from fastapi import APIRouter, HTTPException
from app.models import ChatMessage
from app.database import get_supabase
from google import genai
from google.genai import types
import os
import uuid
from dotenv import load_dotenv

load_dotenv()

router = APIRouter(prefix="/assistant", tags=["AI Assistant"])
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

SYSTEM_PROMPT = """You are a helpful AI assistant for SchemeFinder AI, a platform that helps Indian citizens discover government schemes they may be eligible for.

Your role:
- Answer questions about Indian government schemes clearly and accurately.
- Use the supplied scheme database as the source for scheme-specific details.
- Explain eligibility, benefits, documents, and application steps in simple English.
- Include official website links from the supplied data when relevant.
- If a scheme is not in the supplied data, say so rather than guessing.

Important rules:
- Never invent schemes, benefits, eligibility criteria, or official links.
- If information is missing or uncertain, ask the user to verify it on the relevant official government website.
- Always explain that the relevant government department makes the final eligibility decision.

Use clear headings, short paragraphs, and bullet points where useful.
"""


def build_schemes_context(schemes: list) -> str:
    """Build a readable context string from the scheme database."""
    if not schemes:
        return "No schemes are currently available in the database."

    context = "GOVERNMENT SCHEMES DATABASE:\n\n"
    for scheme in schemes:
        context += f"**{scheme['name']}** (Category: {scheme['category']})\n"
        context += f"Description: {scheme['description']}\n"
        context += f"Benefits: {scheme['benefits']}\n"
        context += f"Eligibility: Age {scheme['min_age']}-{scheme['max_age']}, "
        if scheme['max_annual_income'] < 9999999999:
            context += f"annual income up to ₹{scheme['max_annual_income']:,}, "
        occupations = scheme.get('eligible_occupations') or ['all']
        if 'all' not in [o.lower() for o in occupations]:
            context += f"Occupations: {', '.join(occupations)}, "
        context += "\n"
        context += f"Documents: {', '.join(scheme.get('documents_required') or [])}\n"
        context += f"Application: {scheme['application_procedure']}\n"
        context += f"Official Website: {scheme['official_url']}\n\n"
        context += "---\n"

    return context


@router.post("/chat")
def chat_with_assistant(message: ChatMessage):
    """Answer questions about Indian government schemes using Gemini."""
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="Gemini API key is not configured. Add GEMINI_API_KEY to the backend environment variables."
        )

    try:
        schemes = []
        try:
            db = get_supabase()
            result = db.table("schemes").select("*").eq("is_active", True).execute()
            schemes = result.data or []
        except Exception:
            # Keep general assistant questions available if Supabase is temporarily unavailable.
            schemes = []

        profile_context = ""
        if message.user_profile:
            p = message.user_profile
            profile_context = (
                f"\nUSER PROFILE:\n"
                f"- Age: {p.age} years\n"
                f"- State: {p.state}\n"
                f"- Occupation: {p.occupation}\n"
                f"- Annual income: ₹{p.annual_income:,}\n"
                f"- Education: {p.education}\n"
            )

        prompt = (
            f"{build_schemes_context(schemes)}\n"
            f"{profile_context}\n"
            f"USER QUESTION: {message.message}\n\n"
            "Answer using the supplied scheme information. Do not guess missing details."
        )

        client = genai.Client(api_key=GEMINI_API_KEY)
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=types.GenerateContentConfig(system_instruction=SYSTEM_PROMPT),
        )
        ai_response = response.text or "Sorry, I couldn't generate a response. Please try again."

        sources = list(dict.fromkeys(
            scheme["official_url"] for scheme in schemes
            if scheme["name"].lower() in ai_response.lower()
        ))[:5]

        session_id = message.session_id or str(uuid.uuid4())

        # Chat history is optional; a logging failure should not break the response.
        try:
            db = get_supabase()
            db.table("chat_sessions").insert({
                "session_id": session_id,
                "user_message": message.message,
                "assistant_response": ai_response
            }).execute()
        except Exception:
            pass

        return {
            "response": ai_response,
            "sources": sources,
            "session_id": session_id
        }

    except Exception as e:
        error_msg = str(e).lower()
        if "api key" in error_msg or "api_key" in error_msg or "permission" in error_msg:
            raise HTTPException(
                status_code=503,
                detail="Gemini API key is invalid or does not have access. Check GEMINI_API_KEY in Vercel."
            )
        raise HTTPException(status_code=500, detail="AI assistant is temporarily unavailable. Please try again.")
