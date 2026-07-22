from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.schemas import JobCreate, JobResponse
from app.services.job_service import job_service

router = APIRouter(prefix="/jobs", tags=["Jobs"])

@router.get("", response_model=List[JobResponse])
def list_jobs(
    search: Optional[str] = Query(None, description="Search term for job title, company, or description"),
    location: Optional[str] = Query(None, description="Location filter (e.g. Remote, San Francisco)"),
    job_type: Optional[str] = Query(None, description="Job type filter (Full-time, Contract, Remote, All)"),
    user_skills: Optional[str] = Query(None, description="Comma-separated user skills for matching score"),
    db: Session = Depends(get_db)
):
    candidate_skills = [s.strip() for s in user_skills.split(",")] if user_skills else None
    return job_service.get_jobs(
        db=db,
        search=search,
        location=location,
        job_type=job_type,
        candidate_skills=candidate_skills
    )

@router.get("/{job_id}", response_model=JobResponse)
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = job_service.get_job_by_id(db=db, job_id=job_id)
    if not job:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job listing not found")
    job.match_score = 88
    return job

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(job_in: JobCreate, db: Session = Depends(get_db)):
    return job_service.create_job(db=db, job_in=job_in)
