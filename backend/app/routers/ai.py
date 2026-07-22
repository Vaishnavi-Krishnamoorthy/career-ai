from fastapi import APIRouter, Depends, HTTPException
from typing import List, Dict, Any
from app.models.schemas import (
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    CareerRoadmapRequest,
    CareerRoadmapResponse
)
from app.services.ai_service import ai_service

router = APIRouter(prefix="/ai", tags=["AI & Resume Guidance"])

@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
def analyze_resume(request: ResumeAnalysisRequest):
    if not request.resume_text or len(request.resume_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Resume text must contain at least 10 characters")
    return ai_service.analyze_resume(resume_text=request.resume_text, target_role=request.target_role)

@router.post("/career-roadmap", response_model=CareerRoadmapResponse)
def generate_roadmap(request: CareerRoadmapRequest):
    return ai_service.generate_career_roadmap(
        current_skills=request.current_skills,
        target_role=request.target_role
    )
