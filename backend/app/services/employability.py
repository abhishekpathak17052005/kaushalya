from __future__ import annotations
"""
Employability Score Calculator
------------------------------
Weights:
  Skills Match            30%
  Assessment Performance  15%
  Training Completion     15%
  Certifications          10%
  Experience              10%
  Industry Demand         10%
  Profile Completion      10%
"""
from motor.motor_asyncio import AsyncIOMotorDatabase


async def calculate_employability(user_id: str, db: AsyncIOMotorDatabase) -> dict:
    profile = await db.trainee_profiles.find_one({"user_id": user_id})
    if not profile:
        return _empty_score()

    # 1. Skills Match (30 pts)
    skills_cursor = db.user_skills.find({"user_id": user_id})
    user_skills = await skills_cursor.to_list(length=100)
    skills_score = 0
    if user_skills:
        avg_prof = sum(s.get("proficiency", 0) for s in user_skills) / len(user_skills)
        verified_ratio = sum(1 for s in user_skills if s.get("verified")) / len(user_skills)
        skills_score = int((avg_prof / 100 * 0.7 + verified_ratio * 0.3) * 30)

    # 2. Assessment Performance (15 pts)
    results_cursor = db.assessment_results.find({"user_id": user_id})
    results = await results_cursor.to_list(length=50)
    assessment_score = 0
    if results:
        avg_pct = sum(r.get("percentage", 0) for r in results) / len(results)
        assessment_score = int(avg_pct / 100 * 15)

    # 3. Training Completion (15 pts)
    completed_cursor = db.enrollments.find({"trainee_id": user_id, "status": "COMPLETED"})
    completed = await completed_cursor.to_list(length=50)
    all_enrolled_cursor = db.enrollments.find({"trainee_id": user_id})
    all_enrolled = await all_enrolled_cursor.to_list(length=50)
    training_score = 0
    if all_enrolled:
        completion_ratio = len(completed) / len(all_enrolled)
        training_score = int(completion_ratio * 15)
    elif completed:
        training_score = 10

    # 4. Certifications (10 pts)
    certs_cursor = db.certifications.find({"user_id": user_id})
    certs = await certs_cursor.to_list(length=20)
    cert_score = min(10, len(certs) * 3)

    # 5. Experience (10 pts)
    exp = profile.get("experience", "")
    exp_score = 0
    if "3" in exp or "4" in exp or "5" in exp or "senior" in exp.lower():
        exp_score = 10
    elif "2" in exp or "year" in exp.lower():
        exp_score = 7
    elif "1" in exp or "fresher" in exp.lower() or "intern" in exp.lower():
        exp_score = 4
    elif exp:
        exp_score = 2

    # 6. Industry Demand (10 pts)
    demand_score = 6  # baseline; boosted when top skills match high-demand categories
    if user_skills:
        skill_names = [s.get("skill_name", "").lower() for s in user_skills]
        high_demand = {"aws", "cloud computing", "cybersecurity", "data science", "docker", "python"}
        matched = sum(1 for n in skill_names if any(h in n for h in high_demand))
        demand_score = min(10, 4 + matched * 2)

    # 7. Profile Completion (10 pts)
    profile_pct = _calc_profile_completion(profile)
    profile_score = int(profile_pct / 100 * 10)

    total = (
        skills_score + assessment_score + training_score +
        cert_score + exp_score + demand_score + profile_score
    )
    total = min(100, max(0, total))

    if total >= 80:
        classification = "HIGH"
    elif total >= 60:
        classification = "MEDIUM"
    else:
        classification = "LOW"

    return {
        "score": total,
        "classification": classification,
        "breakdown": {
            "skills": skills_score,
            "assessment": assessment_score,
            "training": training_score,
            "certifications": cert_score,
            "experience": exp_score,
            "demand": demand_score,
            "profile": profile_score,
        },
    }


def _calc_profile_completion(profile: dict) -> int:
    fields = ["name", "email", "phone", "district", "education", "specialization",
              "employment_status", "experience", "target_career"]
    filled = sum(1 for f in fields if profile.get(f))
    return int(filled / len(fields) * 100)


def _empty_score() -> dict:
    return {
        "score": 0,
        "classification": "LOW",
        "breakdown": {
            "skills": 0, "assessment": 0, "training": 0,
            "certifications": 0, "experience": 0, "demand": 0, "profile": 0,
        },
    }
