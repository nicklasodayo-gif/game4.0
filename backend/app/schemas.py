"""Pydantic request/response schemas."""
from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AdminUserResponse(BaseModel):
    id: int
    email: str
    full_name: str

    class Config:
        from_attributes = True


# ---------- Games ----------

class SubmitScoreRequest(BaseModel):
    brand: str
    gridSize: int = Field(..., alias="gridSize")
    moves: int
    time: float
    completed: bool
    playerName: Optional[str] = Field(default="Anonymous", alias="playerName")

    class Config:
        populate_by_name = True


class SubmitLeadRequest(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    company: Optional[str] = ""
    brand: str
    timestamp: Optional[str] = None


class LeaderboardEntryResponse(BaseModel):
    rank: int
    name: str
    time: float
    moves: int
    date: str


# ---------- Analytics ----------

class AnalyticsEventRequest(BaseModel):
    eventType: Literal["attract_start", "game_start", "game_win", "lead_capture", "idle"] = Field(
        ..., alias="eventType"
    )
    brand: str
    metadata: Optional[dict[str, Any]] = None

    class Config:
        populate_by_name = True


class AnalyticsSummaryResponse(BaseModel):
    totalGames: int
    completedGames: int
    completionRate: float
    totalLeads: int
    eventsByType: dict[str, int]
