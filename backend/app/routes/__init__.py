from __future__ import annotations
from fastapi import APIRouter

from app.routes.compat import router as compat_router
from app.routes.auth import router as auth_router
from app.routes.dashboard import router as dashboard_router
from app.routes.trainees import router as trainees_router
from app.routes.skills import router as skills_router
from app.routes.assessments import router as assessments_router
from app.routes.training import router as training_router
from app.routes.employers import router as employers_router
from app.routes.jobs import router as jobs_router
from app.routes.employment import router as employment_router
from app.routes.intelligence import router as intelligence_router
from app.routes.analytics import router as analytics_router
from app.routes.ai import router as ai_router
from app.routes.recommendations import router as recommendations_router

api_router = APIRouter()

# Compatibility routes first (exact paths the frontend hooks call)
api_router.include_router(compat_router)

# Feature routers
api_router.include_router(auth_router)
api_router.include_router(dashboard_router)
api_router.include_router(trainees_router)
api_router.include_router(skills_router)
api_router.include_router(assessments_router)
api_router.include_router(training_router)
api_router.include_router(employers_router)
api_router.include_router(jobs_router)
api_router.include_router(employment_router)
api_router.include_router(intelligence_router)
api_router.include_router(analytics_router)
api_router.include_router(ai_router)
api_router.include_router(recommendations_router)
