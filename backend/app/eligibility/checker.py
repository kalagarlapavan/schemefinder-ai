from typing import List, Tuple


OCCUPATION_MAPPINGS = {
    "farmer": ["Farmer", "Agriculture"],
    "agriculture": ["Farmer", "Agriculture"],
    "student": ["Student"],
    "business owner": ["Business Owner", "Self-employed", "Entrepreneur", "Trader"],
    "self-employed": ["Business Owner", "Self-employed", "Entrepreneur", "Artisan"],
    "entrepreneur": ["Business Owner", "Self-employed", "Entrepreneur"],
    "salaried": ["all"],
    "government employee": ["all"],
    "daily wage worker": ["Daily Wage Worker", "Other"],
    "domestic worker": ["Domestic Worker", "Daily Wage Worker", "Other"],
    "street vendor": ["Street Vendor", "Daily Wage Worker", "Self-employed"],
    "artisan": ["Artisan", "Self-employed"],
    "fisherman": ["Fisherman", "Farmer", "Agriculture"],
    "retired": ["all"],
    "unemployed": ["Student", "Unemployed", "Daily Wage Worker", "Other"],
    "other": ["Other"],
}

EDUCATION_ORDER = [
    "No Formal Education",
    "5th Pass",
    "8th Pass",
    "10th Pass",
    "12th Pass",
    "Diploma",
    "Graduate",
    "Post Graduate",
    "PhD",
]


def normalize_occupation(occupation: str) -> List[str]:
    """Return list of occupation tags that match for scheme lookup."""
    lower = occupation.lower().strip()
    for key, tags in OCCUPATION_MAPPINGS.items():
        if key in lower:
            return tags
    return ["Other", "all"]


def education_level_index(edu: str) -> int:
    """Return numeric index of education level."""
    edu_clean = edu.strip()
    for i, level in enumerate(EDUCATION_ORDER):
        if level.lower() == edu_clean.lower():
            return i
    return 2  # default to 8th pass if unknown


def check_scheme_eligibility(scheme: dict, profile: dict) -> Tuple[str, str, List[str]]:
    """
    Check if a profile is eligible for a scheme.

    Returns:
        (status, match_reason, missing_info)
        status: "ELIGIBLE" | "PARTIAL" | "NOT_ELIGIBLE"
    """
    age = profile["age"]
    state = profile["state"]
    occupation = profile["occupation"]
    annual_income = profile["annual_income"]
    education = profile["education"]

    reasons_met = []
    reasons_failed = []
    missing_info = []

    # --- Age check ---
    min_age = scheme.get("min_age", 0)
    max_age = scheme.get("max_age", 120)
    if min_age <= age <= max_age:
        if min_age > 0 or max_age < 120:
            reasons_met.append(f"Age {age} is within the required range ({min_age}–{max_age} years)")
    else:
        if age < min_age:
            reasons_failed.append(f"Minimum age required is {min_age} years (you are {age})")
        else:
            reasons_failed.append(f"Maximum age allowed is {max_age} years (you are {age})")

    # --- Income check ---
    max_income = scheme.get("max_annual_income", 9999999999)
    if max_income < 9999999999:
        if annual_income <= max_income:
            reasons_met.append(f"Annual income ₹{annual_income:,} is within the limit (max ₹{max_income:,})")
        else:
            reasons_failed.append(f"Annual income ₹{annual_income:,} exceeds the scheme limit of ₹{max_income:,}")

    # --- Occupation check ---
    eligible_occupations = scheme.get("eligible_occupations", ["all"])
    if "all" not in [o.lower() for o in eligible_occupations]:
        user_occ_tags = normalize_occupation(occupation)
        occ_match = any(
            tag.lower() in [o.lower() for o in eligible_occupations]
            for tag in user_occ_tags
        )
        if occ_match:
            reasons_met.append(f"Occupation '{occupation}' matches the scheme's eligible occupations")
        else:
            reasons_failed.append(f"This scheme is meant for: {', '.join(eligible_occupations)}. Your occupation is '{occupation}'")

    # --- State check ---
    eligible_states = scheme.get("eligible_states", ["all"])
    if "all" not in [s.lower() for s in eligible_states]:
        if state.lower() in [s.lower() for s in eligible_states]:
            reasons_met.append(f"Your state ({state}) is covered by this scheme")
        else:
            reasons_failed.append(f"This scheme is only available in: {', '.join(eligible_states)}")

    # --- Education check ---
    eligible_education = scheme.get("eligible_education", ["all"])
    if "all" not in [e.lower() for e in eligible_education]:
        user_edu_idx = education_level_index(education)
        scheme_edu_indices = [education_level_index(e) for e in eligible_education]
        min_scheme_edu = min(scheme_edu_indices)
        if user_edu_idx >= min_scheme_edu:
            reasons_met.append(f"Education level '{education}' meets the requirement")
        else:
            reasons_failed.append(
                f"Minimum education required: {eligible_education[scheme_edu_indices.index(min_scheme_edu)]}. "
                f"Your level: {education}"
            )

    # --- Determine status ---
    if reasons_failed:
        match_reason = "Not eligible: " + "; ".join(reasons_failed)
        return "NOT_ELIGIBLE", match_reason, missing_info

    if reasons_met:
        match_reason = "You may be eligible because: " + "; ".join(reasons_met)
    else:
        match_reason = "You appear to meet the basic eligibility criteria for this scheme"

    # Check for partial (requires verification)
    scheme_name_lower = scheme.get("name", "").lower()
    if "sc" in scheme_name_lower or "st" in scheme_name_lower or "obc" in scheme_name_lower or "scheduled" in scheme_name_lower:
        missing_info.append("Caste/community certificate (SC/ST/OBC) required for verification")

    return "ELIGIBLE", match_reason, missing_info


def run_eligibility_check(schemes: List[dict], profile: dict) -> List[dict]:
    """Run eligibility check for all schemes and return sorted results."""
    results = []

    for scheme in schemes:
        status, match_reason, missing_info = check_scheme_eligibility(scheme, profile)
        results.append({
            "scheme_id": str(scheme.get("id", "")),
            "scheme_name": scheme.get("name", ""),
            "status": status,
            "match_reason": match_reason,
            "missing_info": missing_info,
            "scheme": scheme,
        })

    # Sort: ELIGIBLE first, then PARTIAL, then NOT_ELIGIBLE
    order = {"ELIGIBLE": 0, "PARTIAL": 1, "NOT_ELIGIBLE": 2}
    results.sort(key=lambda r: order.get(r["status"], 3))

    return results
