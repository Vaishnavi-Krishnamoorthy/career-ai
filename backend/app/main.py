from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.routers import health, jobs, hackathons, ai

# Initialize DB tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Seed database on startup
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()
    yield

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
    description="Production REST API for Career AI: AI-powered job searching, hackathon discovery, and career guidance.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware setup
origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",") if origin.strip()]
is_wildcard = "*" in origins or not origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if is_wildcard else origins,
    allow_origin_regex=r"https://.*\.onrender\.com",
    allow_credentials=False if is_wildcard else True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(health.router, prefix=settings.API_V1_STR)
app.include_router(jobs.router, prefix=settings.API_V1_STR)
app.include_router(hackathons.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "message": "Welcome to Career AI API",
        "docs": "/docs",
        "health": f"{settings.API_V1_STR}/health"
    }
