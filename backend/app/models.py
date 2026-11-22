from pydantic import BaseModel, Field
from typing import Optional, List
from uuid import UUID


class Scheme(BaseModel):
    id: UUID
    name: str
    description: str
    category: str
    min_age: int
    max_age: int
    max_annual_income: int
    eligible_occupations: List[str]
    eligible_states: List[str]
    eligible_education: List[str]
    benefits: str
    documents_required: List[str]
    application_procedure: str
    official_url: str
    source_url: str
    is_central: bool
    is_active: bool


class CitizenProfile(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Age of the citizen")
    state: str = Field(..., min_length=2, description="State of residence")
    occupation: str = Field(..., min_length=2, description="Current occupation")
    annual_income: int = Field(..., ge=0, description="Annual family income in INR")
    education: str = Field(..., min_length=2, description="Highest education level")


class EligibilityResult(BaseModel):
    scheme_id: str
    scheme_name: str
    status: str  # ELIGIBLE | PARTIAL | NOT_ELIGIBLE
    match_reason: str
    missing_info: List[str]
    scheme: dict


class EligibilityResponse(BaseModel):
    profile: dict
    results: List[EligibilityResult]
    total_eligible: int
    total_partial: int
    total_not_eligible: int


class ChatMessage(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)
    session_id: Optional[str] = None
    user_profile: Optional[CitizenProfile] = None


class ChatResponse(BaseModel):
    response: str
    sources: List[str]
    session_id: str
