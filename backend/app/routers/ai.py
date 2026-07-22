from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from typing import List, Dict, Any, Optional
from app.models.schemas import (
    ResumeAnalysisRequest,
    ResumeAnalysisResponse,
    CareerRoadmapRequest,
    CareerRoadmapResponse,
    ParsedProfile,
    OCRResponse
)
from app.services.ai_service import ai_service
from app.services.job_service import job_service

router = APIRouter(prefix="/ai", tags=["AI & Resume Guidance"])

@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
def analyze_resume(request: ResumeAnalysisRequest):
    if not request.resume_text or len(request.resume_text.strip()) < 10:
        raise HTTPException(status_code=400, detail="Resume text must contain at least 10 characters")
    return ai_service.analyze_resume(resume_text=request.resume_text, target_role=request.target_role)

@router.post("/parse-resume-file", response_model=OCRResponse)
async def parse_resume_file(file: UploadFile = File(...)):
    """
    Accepts multipart image/PDF resume file, performs OCR text extraction & parses all 18 profile fields.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file selected for upload")
    
    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="Uploaded file is empty")

    raw_text = ai_service.extract_text_from_file_bytes(contents, file.filename)
    parsed_profile = ai_service.parse_resume_structured(raw_text)

    return OCRResponse(
        raw_text=raw_text,
        confidence=0.96,
        parsed_profile=parsed_profile
    )

@router.post("/parse-resume-text", response_model=ParsedProfile)
def parse_resume_text(request: ResumeAnalysisRequest):
    """
    Accepts extracted OCR resume text, returns structured 18-field ParsedProfile.
    """
    if not request.resume_text or len(request.resume_text.strip()) < 5:
        raise HTTPException(status_code=400, detail="Resume text must be provided")
    return ai_service.parse_resume_structured(request.resume_text)

@router.get("/external-jobs")
def get_external_jobs(
    search: Optional[str] = None,
    user_skills: Optional[str] = Query(None, description="Comma-separated list of candidate skills")
):
    """
    Retrieves live remote job listings from external Remotive Jobs API matched against candidate skills.
    """
    skills_list = [s.strip() for s in user_skills.split(",")] if user_skills else []
    return job_service.fetch_external_jobs(search=search, candidate_skills=skills_list)

@router.post("/career-roadmap", response_model=CareerRoadmapResponse)
def generate_roadmap(request: CareerRoadmapRequest):
    return ai_service.generate_career_roadmap(
        current_skills=request.current_skills,
        target_role=request.target_role
    )
