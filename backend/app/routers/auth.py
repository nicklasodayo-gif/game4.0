"""Admin authentication endpoints."""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..core.security import create_access_token, verify_password
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


@router.post("/login", response_model=schemas.TokenResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)) -> schemas.TokenResponse:
    user = db.query(models.AdminUser).filter(models.AdminUser.email == payload.email).first()

    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    token = create_access_token(subject=user.email)
    return schemas.TokenResponse(access_token=token)


@router.get("/me", response_model=schemas.AdminUserResponse)
def read_current_user(current_user: models.AdminUser = Depends(get_current_user)) -> models.AdminUser:
    return current_user
