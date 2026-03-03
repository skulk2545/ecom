from functools import lru_cache
from typing import List

from pydantic import AnyHttpUrl
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # General
    PROJECT_NAME: str = "Ecommerce API"
    API_V1_STR: str = "/api"

    # Security
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 1 day
    ADMIN_REGISTRATION_CODE: str | None = None

    # Database
    DATABASE_URL: str  # e.g. postgresql+psycopg2://user:pass@host:5432/dbname

    # CORS
    CORS_ALLOW_ORIGINS: List[AnyHttpUrl] = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ]

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

