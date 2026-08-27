from __future__ import annotations
"""
Compatibility routes — these paths exactly match the existing OpenAPI contract
consumed by the @workspace/api-client-react generated hooks.

The frontend calls:
  GET  /api/healthz
  GET  /api/dashboard/government
  GET  /api/dashboard/trainee/:traineeId
  GET  /api/districts
  GET  /api/districts/:district
  GET  /api/skill-demand
  GET  /api/forecast
  GET  /api/trainees/:traineeId
  PATCH /api/trainees/:traineeId
  GET  /api/jobs
  POST /api/jobs
  POST /api/jobs/:jobId/apply
  GET  /api/job-matches/:traineeId
  GET  /api/skills
  GET  /api/training-programs
  POST /api/training-programs
  GET  /api/recommendations/:traineeId
  POST /api/assistant/career-advice

These are re-exported from the appropriate route modules.
"""
from fastapi import APIRouter, Depends, Query
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.database.connection import get_db, check_db_health
from app.analytics.skill_demand import get_skill_demand
from app.analytics.forecasting import get_skill_forecast
from app.analytics.district_intelligence import list_districts, get_district

router = APIRouter(tags=["Compatibility"])


@router.get("/healthz")
async def health_check():
    db_ok = await check_db_health()
    return {
        "status": "ok",
        "database": "connected" if db_ok else "disconnected",
        "service": "kaushalya-api",
    }


# The district, skill-demand, forecast endpoints are aliased here
# so both /api/districts and /api/intelligence/districts work.

@router.get("/districts")
async def list_districts_compat(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await list_districts(db)


@router.get("/districts/{district}")
async def get_district_compat(district: str, db: AsyncIOMotorDatabase = Depends(get_db)):
    from fastapi import HTTPException
    result = await get_district(district, db)
    if not result:
        raise HTTPException(status_code=404, detail="District not found")
    return result


@router.get("/skill-demand")
async def skill_demand_compat(
    industry: str = Query(default=""),
    district: str = Query(default=""),
    db: AsyncIOMotorDatabase = Depends(get_db),
):
    return await get_skill_demand(db, industry or None, district or None)


@router.get("/forecast")
async def forecast_compat(db: AsyncIOMotorDatabase = Depends(get_db)):
    return await get_skill_forecast(db)
