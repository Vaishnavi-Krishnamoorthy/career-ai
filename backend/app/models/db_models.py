import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, Text, DateTime, JSON
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    job_type = Column(String(50), nullable=False, default="Full-time") # Full-time, Contract, Internship, Remote
    experience_level = Column(String(50), default="Mid-Level") # Entry, Mid-Level, Senior
    salary_range = Column(String(100), nullable=True)
    description = Column(Text, nullable=False)
    skills = Column(JSON, nullable=False, default=list) # List of required skill strings
    application_url = Column(String(500), nullable=True)
    is_remote = Column(Boolean, default=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

class Hackathon(Base):
    __tablename__ = "hackathons"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String(255), nullable=False, index=True)
    organizer = Column(String(255), nullable=False)
    mode = Column(String(50), nullable=False, default="Online") # Online, Hybrid, In-Person
    prize_pool = Column(String(100), nullable=False)
    start_date = Column(String(100), nullable=False)
    end_date = Column(String(100), nullable=False)
    tags = Column(JSON, nullable=False, default=list) # e.g. ["AI", "Web3", "Beginner Friendly"]
    description = Column(Text, nullable=False)
    registration_url = Column(String(500), nullable=False)
    banner_url = Column(String(500), nullable=True)
    is_featured = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))

class UserProfile(Base):
    __tablename__ = "user_profiles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    experience_level = Column(String(50), default="Intermediate")
    skills = Column(JSON, default=list)
    bio = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc).replace(tzinfo=None))
