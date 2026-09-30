"""
Configuración centralizada del sistema utilizando variables de entorno.
"""

import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings
from pydantic import Field


BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    PORT: int = 8000
    HOST: str = "127.0.0.1"
    CORS_ORIGINS: List[str] = ["*"]

    # MySQL Database Config
    DB_HOST: str = "127.0.0.1"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "proyecto_sofia"

    # JWT Security
    SECRET_KEY: str = "sofia_super_secret_jwt_key_2026_tiktok_clone"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # Media uploads
    UPLOAD_DIR: str = str(BASE_DIR / "uploads")
    MAX_VIDEO_SIZE_MB: int = 100
    ALLOWED_VIDEO_EXTENSIONS: List[str] = ["mp4", "mov", "webm", "avi"]
    ALLOWED_IMAGE_EXTENSIONS: List[str] = ["jpg", "jpeg", "png", "webp"]

    # Parental Control Defaults
    DEFAULT_SCREEN_TIME_LIMIT_MINS: int = 120
    DEFAULT_CURFEW_START: str = "22:00"
    DEFAULT_CURFEW_END: str = "06:00"

    @property
    def database_url(self) -> str:
        """Genera el Connection String para SQLAlchemy con driver PyMySQL."""
        pwd = f":{self.DB_PASSWORD}" if self.DB_PASSWORD else ""
        return f"mysql+pymysql://{self.DB_USER}{pwd}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"

    class Config:
        env_file = str(BASE_DIR / ".env")
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
