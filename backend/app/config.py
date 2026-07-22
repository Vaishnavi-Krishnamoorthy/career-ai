from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "Career AI Backend"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite:///./career_ai.db"
    CORS_ORIGINS: str = "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,https://career-ai-frontend-tz1o.onrender.com,*"
    GEMINI_API_KEY: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
