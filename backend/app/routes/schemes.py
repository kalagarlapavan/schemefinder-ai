from fastapi import APIRouter, HTTPException, Query
from typing import Optional
from app.database import get_supabase

router = APIRouter(prefix="/schemes", tags=["Schemes"])


@router.get("")
def get_all_schemes(
    search: Optional[str] = Query(None, description="Search by scheme name"),
    category: Optional[str] = Query(None, description="Filter by category"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Get all active schemes with optional search and category filter."""
    try:
        db = get_supabase()
        query = db.table("schemes").select("*").eq("is_active", True)

        if category and category.lower() != "all":
            query = query.eq("category", category)

        if search:
            query = query.ilike("name", f"%{search}%")

        result = query.range(offset, offset + limit - 1).order("name").execute()
        return {
            "schemes": result.data,
            "count": len(result.data),
            "offset": offset,
            "limit": limit
        }
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/categories")
def get_categories():
    """Get all unique scheme categories."""
    try:
        db = get_supabase()
        result = db.table("schemes").select("category").eq("is_active", True).execute()
        categories = sorted(list(set(r["category"] for r in result.data)))
        return {"categories": categories}
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")


@router.get("/{scheme_id}")
def get_scheme(scheme_id: str):
    """Get a single scheme by ID."""
    try:
        db = get_supabase()
        result = db.table("schemes").select("*").eq("id", scheme_id).eq("is_active", True).execute()
        if not result.data:
            raise HTTPException(status_code=404, detail="Scheme not found")
        return result.data[0]
    except HTTPException:
        raise
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
