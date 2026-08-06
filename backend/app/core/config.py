"""Application settings, loaded from environment variables / .env."""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    secret_key: str = "change-this-to-a-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480

    cors_origins: str = "http://localhost:5173,http://localhost:5174"

    database_url: str = "sqlite:///./red_giant.db"

    admin_email: str = "admin@redgiant.co.ke"
    admin_password: str = "change-me-please"

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
