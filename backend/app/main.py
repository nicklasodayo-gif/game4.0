
"""FastAPI application entrypoint for the Red Giant activation platform backend."""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import models
from .core.config import get_settings
from .database import Base, engine
from .routers import analytics, auth, games

settings = get_settings()

# Auto-create tables on startup. For production, prefer Alembic migrations.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Red Giant Activation Platform API",
    description="Backend for the kiosk-player and admin-dashboard apps.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(games.router)
app.include_router(analytics.router)


@app.get("/", tags=["health"])
def health_check() -> dict:
    return {"status": "ok", "service": "red-giant-backend"}
