from __future__ import annotations
import logging
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from bson import ObjectId

from app.auth.password import hash_password, verify_password
from app.auth.jwt import create_access_token
from app.auth.dependencies import get_current_user
from app.database.connection import get_db
from app.config.settings import get_settings
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse, UserResponse
from app.models.base import utcnow

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["Authentication"])
settings = get_settings()


def _user_to_response(user: dict) -> UserResponse:
    return UserResponse(
        id=str(user["_id"]),
        name=user.get("name", ""),
        email=user.get("email", ""),
        role=user.get("role", "TRAINEE"),
        organization=user.get("organization"),
        created_at=str(user.get("created_at", "")),
    )


def _make_token(user: dict) -> TokenResponse:
    expire_minutes = settings.ACCESS_TOKEN_EXPIRE_MINUTES
    token = create_access_token(
        {"user_id": str(user["_id"]), "role": user["role"]},
        timedelta(minutes=expire_minutes),
    )
    return TokenResponse(
        access_token=token,
        expires_in=expire_minutes * 60,
        user=_user_to_response(user),
    )


@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")

    now = utcnow()
    user_doc = {
        "name": body.name,
        "email": body.email.lower(),
        "password_hash": hash_password(body.password),
        "role": body.role,
        "organization": body.organization,
        "is_active": True,
        "created_at": now,
        "updated_at": now,
    }
    result = await db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id

    # Create role-specific profile
    if body.role == "TRAINEE":
        await db.trainee_profiles.insert_one({
            "user_id": str(result.inserted_id),
            "name": body.name,
            "email": body.email.lower(),
            "phone": "",
            "district": "",
            "state": "Maharashtra",
            "education": "",
            "specialization": "",
            "employment_status": "Open to work",
            "experience": "",
            "target_career": "",
            "profile_completion": 10,
            "created_at": now,
            "updated_at": now,
        })
    elif body.role == "EMPLOYER":
        await db.employers.insert_one({
            "user_id": str(result.inserted_id),
            "company_name": body.organization or "",
            "industry": "",
            "location": "",
            "website": "",
            "description": "",
            "size": "",
            "verified": False,
            "created_at": now,
        })
    elif body.role == "TRAINING_INSTITUTE":
        await db.training_institutes.insert_one({
            "user_id": str(result.inserted_id),
            "name": body.organization or body.name,
            "location": {"district": "", "state": "Maharashtra"},
            "accredited": False,
            "created_at": now,
        })

    logger.info("New user registered: %s (%s)", body.email, body.role)
    return _make_token(user_doc)


@router.post("/login", response_model=TokenResponse)
async def login(body: LoginRequest, db: AsyncIOMotorDatabase = Depends(get_db)):
    user = await db.users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user.get("password_hash", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    if not user.get("is_active", True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account disabled")

    logger.info("User logged in: %s", body.email)
    return _make_token(user)


@router.get("/me", response_model=UserResponse)
async def me(user: dict = Depends(get_current_user)):
    return _user_to_response(user)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(user: dict = Depends(get_current_user)):
    return _make_token(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def logout(user: dict = Depends(get_current_user)):
    # JWT is stateless; client discards the token
    return None
