from fastapi import APIRouter, HTTPException
from app.models import CitizenProfile
from app.database import get_supabase
from app.eligibility.checker import run_eligibility_check

router = APIRouter(prefix="/eligibility", tags=["Eligibility"])


@router.post("/check")
def check_eligibility(profile: CitizenProfile):
    """
    Check eligibility for all government schemes based on citizen profile.
    Returns matched schemes sorted by eligibility status.
    """
    try:
        db = get_supabase()
        result = db.table("schemes").select("*").eq("is_active", True).execute()
        schemes = result.data

        if not schemes:
            return {
                "profile": profile.model_dump(),
                "results": [],
                "total_eligible": 0,
                "total_partial": 0,
                "total_not_eligible": 0,
                "message": "No schemes found in database."
            }

        profile_dict = profile.model_dump()
        results = run_eligibility_check(schemes, profile_dict)

        total_eligible = sum(1 for r in results if r["status"] == "ELIGIBLE")
        total_partial = sum(1 for r in results if r["status"] == "PARTIAL")
        total_not_eligible = sum(1 for r in results if r["status"] == "NOT_ELIGIBLE")

        return {
            "profile": profile_dict,
            "results": results,
            "total_eligible": total_eligible,
            "total_partial": total_partial,
            "total_not_eligible": total_not_eligible,
            "disclaimer": (
                "These results are indicative only. Final eligibility is determined by the "
                "relevant government department. Please verify all details at the official scheme websites."
            )
        }

    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Eligibility check failed: {str(e)}")
