"""Analytics event ingestion + summary endpoints.

Event ingestion is public (called by the unattended kiosk); the summary
endpoint used by the admin dashboard requires authentication.
"""
import json

from fastapi import APIRouter, Depends, Query
from sqlalchemy import func
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..deps import get_current_user

router = APIRouter(prefix="/api/analytics", tags=["analytics"])


@router.post("/event", status_code=201)
def track_event(payload: schemas.AnalyticsEventRequest, db: Session = Depends(get_db)) -> dict:
    event = models.AnalyticsEvent(
        brand=payload.brand,
        event_type=payload.eventType,
        metadata_json=json.dumps(payload.metadata or {}),
    )
    db.add(event)
    db.commit()
    return {"status": "recorded"}


@router.get("/summary", response_model=schemas.AnalyticsSummaryResponse)
def get_summary(
    brand: str = Query(...),
    db: Session = Depends(get_db),
    _current_user: models.AdminUser = Depends(get_current_user),
) -> schemas.AnalyticsSummaryResponse:
    total_games = (
        db.query(func.count(models.GameSession.id)).filter(models.GameSession.brand == brand).scalar() or 0
    )
    completed_games = (
        db.query(func.count(models.GameSession.id))
        .filter(models.GameSession.brand == brand, models.GameSession.completed.is_(True))
        .scalar()
        or 0
    )
    total_leads = db.query(func.count(models.Lead.id)).filter(models.Lead.brand == brand).scalar() or 0

    completion_rate = round((completed_games / total_games) * 100, 1) if total_games else 0.0

    event_rows = (
        db.query(models.AnalyticsEvent.event_type, func.count(models.AnalyticsEvent.id))
        .filter(models.AnalyticsEvent.brand == brand)
        .group_by(models.AnalyticsEvent.event_type)
        .all()
    )
    events_by_type = {event_type: count for event_type, count in event_rows}

    return schemas.AnalyticsSummaryResponse(
        totalGames=total_games,
        completedGames=completed_games,
        completionRate=completion_rate,
        totalLeads=total_leads,
        eventsByType=events_by_type,
    )
