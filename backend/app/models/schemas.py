from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from datetime import datetime

# Job Schemas
class JobBase(BaseModel):
    title: str
    company: str
    location: str
    job_type: str = "Full-time"
    experience_level: str = "Mid-Level"
    salary_range: Optional[str] = "$100k - $140k"
    description: str
    skills: List[str] = []
    application_url: Optional[str] = "https://example.com/apply"
    is_remote: bool = True

class JobCreate(JobBase):
    pass

class JobResponse(JobBase):
    id: str
    created_at: datetime
    match_score: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

# Hackathon Schemas
class HackathonBase(BaseModel):
    title: str
    organizer: str
    mode: str = "Online"
    prize_pool: str
    start_date: str
    end_date: str
    tags: List[str] = []
    description: str
    registration_url: str
    banner_url: Optional[str] = None
    is_featured: bool = False

class HackathonCreate(HackathonBase):
    pass

class HackathonResponse(HackathonBase):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

# AI Analysis Request & Response Schemas
class ResumeAnalysisRequest(BaseModel):
    resume_text: str = Field(..., description="Plain text or markdown content of the user resume")
    target_role: Optional[str] = Field(None, description="Optional target job title or role")

class ResumeAnalysisResponse(BaseModel):
    extracted_name: Optional[str] = "Developer Candidate"
    skills_found: List[str]
    experience_level: str
    strengths: List[str]
    skill_gaps: List[str]
    recommended_roles: List[str]
    summary: str

class CareerRoadmapRequest(BaseModel):
    current_skills: List[str]
    target_role: str

class RoadmapStep(BaseModel):
    step_number: int
    title: str
    description: str
    recommended_resources: List[str]

class CareerRoadmapResponse(BaseModel):
    target_role: str
    estimated_timeline: str
    steps: List[RoadmapStep]

class UserProfileCreate(BaseModel):
    full_name: str
    email: str
    experience_level: str = "Intermediate"
    skills: List[str] = []
    bio: Optional[str] = None

class UserProfileResponse(UserProfileCreate):
    id: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
