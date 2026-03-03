from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import create_access_token
from app.db.dependencies import get_db
from app.models.user import UserRole
from app.schemas import AdminUserCreate, Token, UserCreate, UserLogin, UserRead
from app.services.user_service import authenticate_user, create_user

router = APIRouter()


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(payload: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    try:
        user = create_user(
            db,
            name=payload.name,
            email=payload.email,
            password=payload.password,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return user


@router.post("/register-admin", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_admin(payload: AdminUserCreate, db: Session = Depends(get_db)) -> UserRead:
    if not settings.ADMIN_REGISTRATION_CODE or payload.code != settings.ADMIN_REGISTRATION_CODE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid admin registration code",
        )
    try:
        user = create_user(
            db,
            name=payload.name,
            email=payload.email,
            password=payload.password,
            role=UserRole.ADMIN,
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return user


@router.post("/login", response_model=Token)
def login(payload: UserLogin, db: Session = Depends(get_db)) -> Token:
    user = authenticate_user(db, email=payload.email, password=payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(subject=str(user.id), role=user.role, expires_delta=access_token_expires)
    return Token(access_token=access_token)

