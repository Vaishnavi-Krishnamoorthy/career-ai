from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.db_models import Job
from app.models.schemas import JobCreate
from app.services.ai_service import ai_service

class JobService:
    def get_jobs(
        self,
        db: Session,
        search: Optional[str] = None,
        location: Optional[str] = None,
        job_type: Optional[str] = None,
        skills: Optional[List[str]] = None,
        candidate_skills: Optional[List[str]] = None
    ) -> List[Job]:
        query = db.query(Job)

        if search:
            search_pattern = f"%{search}%"
            query = query.filter(
                (Job.title.ilike(search_pattern)) | 
                (Job.company.ilike(search_pattern)) | 
                (Job.description.ilike(search_pattern))
            )

        if location:
            query = query.filter(Job.location.ilike(f"%{location}%"))

        if job_type and job_type.lower() != "all":
            query = query.filter(Job.job_type.ilike(job_type))

        jobs = query.order_by(Job.created_at.desc()).all()

        # If candidate skills provided, attach calculated match scores
        if candidate_skills:
            for job in jobs:
                job.match_score = ai_service.calculate_match_score(candidate_skills, job.skills or [])
        else:
            for job in jobs:
                job.match_score = 85

        return jobs

    def get_job_by_id(self, db: Session, job_id: str) -> Optional[Job]:
        return db.query(Job).filter(Job.id == job_id).first()

    def create_job(self, db: Session, job_in: JobCreate) -> Job:
        job = Job(**job_in.model_dump())
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

job_service = JobService()
