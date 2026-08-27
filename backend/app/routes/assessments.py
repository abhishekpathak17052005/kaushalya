from __future__ import annotations
import logging
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.auth.dependencies import get_current_user
from app.database.connection import get_db
from app.schemas.assessment import AssessmentSubmit
from app.utils.serializer import serialize_doc, serialize_docs
from app.models.base import utcnow

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/assessments", tags=["Assessments"])


def _proficiency_level(pct: int) -> str:
    if pct >= 86: return "Expert"
    if pct >= 71: return "Advanced"
    if pct >= 51: return "Intermediate"
    if pct >= 31: return "Basic"
    return "Beginner"


@router.get("")
async def list_assessments(db: AsyncIOMotorDatabase = Depends(get_db)):
    cursor = db.skill_assessments.find().limit(50)
    docs = await cursor.to_list(length=50)
    result = []
    for d in docs:
        r = serialize_doc(d) or {}
        r.pop("questions", None)  # Don't return answers in list view
        result.append(r)
    return result


@router.get("/results/me")
async def my_results(
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user_id = str(user["_id"])
    cursor = db.assessment_results.find({"user_id": user_id}).sort("completed_at", -1)
    docs = await cursor.to_list(length=50)
    return serialize_docs(docs)


@router.get("/{assessment_id}")
async def get_assessment(
    assessment_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    doc = await db.skill_assessments.find_one({"_id": ObjectId(assessment_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Assessment not found")
    result = serialize_doc(doc) or {}
    # Strip correct_option_id from questions before sending to client
    for q in result.get("questions", []):
        q.pop("correct_option_id", None)
    return result


@router.post("/{assessment_id}/submit")
async def submit_assessment(
    assessment_id: str,
    body: AssessmentSubmit,
    user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    user_id = str(user["_id"])
    assessment = await db.skill_assessments.find_one({"_id": ObjectId(assessment_id)})
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    questions = assessment.get("questions", [])
    answer_map = {a.question_id: a.selected_option_id for a in body.answers}

    correct = 0
    total_points = 0
    earned_points = 0
    for q in questions:
        pts = q.get("points", 1)
        total_points += pts
        if answer_map.get(q["id"]) == q.get("correct_option_id"):
            correct += 1
            earned_points += pts

    percentage = int(earned_points / total_points * 100) if total_points else 0
    level = _proficiency_level(percentage)
    now = utcnow()

    result_doc = {
        "user_id": user_id,
        "assessment_id": assessment_id,
        "skill_id": assessment.get("skill_id", ""),
        "skill_name": assessment.get("skill_name", ""),
        "score": earned_points,
        "total": total_points,
        "percentage": percentage,
        "proficiency_level": level,
        "passed": percentage >= 50,
        "completed_at": now,
    }
    res = await db.assessment_results.insert_one(result_doc)
    result_doc["_id"] = res.inserted_id

    # Update user_skills proficiency
    skill_id = assessment.get("skill_id", "")
    if skill_id:
        existing_skill = await db.user_skills.find_one({"user_id": user_id, "skill_id": skill_id})
        if existing_skill:
            await db.user_skills.update_one(
                {"user_id": user_id, "skill_id": skill_id},
                {"$set": {
                    "assessment_score": percentage,
                    "proficiency": percentage,
                    "level": level,
                    "verified": percentage >= 50,
                    "updated_at": now,
                }},
            )
        else:
            skill_doc = await db.skills.find_one({"_id": ObjectId(skill_id)}) if ObjectId.is_valid(skill_id) else None
            if skill_doc:
                await db.user_skills.insert_one({
                    "user_id": user_id,
                    "skill_id": skill_id,
                    "skill_name": skill_doc.get("name", assessment.get("skill_name", "")),
                    "category": skill_doc.get("category", ""),
                    "proficiency": percentage,
                    "level": level,
                    "verified": percentage >= 50,
                    "assessment_score": percentage,
                    "source": "assessment",
                    "created_at": now,
                    "updated_at": now,
                })

    return serialize_doc(result_doc)
