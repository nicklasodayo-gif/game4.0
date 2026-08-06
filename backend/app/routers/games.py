"""Game session, score, and lead-capture endpoints (public — the kiosk
calls these without authentication, since it runs unattended on-site).
"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db

router = APIRouter(prefix="/api/games", tags=["games"])


@router.post("/score", status_code=201)
def submit_score(payload: schemas.SubmitScoreRequest, db: Session = Depends(get_db)) -> dict:
    session = models.GameSession(
        brand=payload.brand,
        grid_size=payload.gridSize,
        moves=payload.moves,
        time_seconds=payload.time,
        completed=payload.completed,
        player_name=payload.playerName or "Anonymous",
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return {"id": session.id, "status": "recorded"}


@router.post("/leads", status_code=201)
def submit_lead(payload: schemas.SubmitLeadRequest, db: Session = Depends(get_db)) -> dict:
    lead = models.Lead(
        brand=payload.brand,
        name=payload.name,
        phone=payload.phone,
        email=payload.email or "",
        company=payload.company or "",
    )
    db.add(lead)
    db.commit()
    db.refresh(lead)
    return {"id": lead.id, "status": "recorded"}


@router.get("/leaderboard", response_model=list[schemas.LeaderboardEntryResponse])
def get_leaderboard(
    brand: str = Query(...),
    limit: int = Query(20, le=100),
    db: Session = Depends(get_db),
) -> list[schemas.LeaderboardEntryResponse]:
    sessions = (
        db.query(models.GameSession)
        .filter(models.GameSession.brand == brand, models.GameSession.completed.is_(True))
        .order_by(models.GameSession.time_seconds.asc())
        .limit(limit)
        .all()
    )

    return [
        schemas.LeaderboardEntryResponse(
            rank=index + 1,
            name=session.player_name or "Anonymous",
            time=session.time_seconds,
            moves=session.moves,
            date=session.created_at.isoformat(),
        )
        for index, session in enumerate(sessions)
    ]
