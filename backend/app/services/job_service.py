import httpx
from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.db_models import Job
from app.models.schemas import JobCreate, JobResponse
from app.services.ai_service import ai_service

REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs"

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

    def fetch_external_jobs(
        self,
        search: Optional[str] = None,
        candidate_skills: Optional[List[str]] = None,
        limit: int = 15
    ) -> List[Dict[str, Any]]:
        """
        Fetches remote jobs from Remotive API, computes candidate skill match scores, and falls back gracefully.
        """
        results = []
        try:
            params = {}
            if search:
                params["search"] = search
            response = httpx.get(REMOTIVE_API_URL, params=params, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                raw_jobs = data.get("jobs", [])[:limit]
                for item in raw_jobs:
                    job_tags = item.get("tags", [])
                    job_title = item.get("title", "Remote Developer")
                    company = item.get("company_name", "Tech Enterprise")
                    desc = item.get("description", "")
                    
                    # Extract skills from tags & title
                    extracted_skills = list(set([t.capitalize() for t in job_tags if len(t) < 20][:6]))
                    if not extracted_skills:
                        extracted_skills = ["Python", "React", "REST API", "SQL"]

                    match_score = 85
                    if candidate_skills:
                        match_score = ai_service.calculate_match_score(candidate_skills, extracted_skills)

                    results.append({
                        "id": f"remotive-{item.get('id')}",
                        "title": job_title,
                        "company": company,
                        "location": item.get("candidate_required_location", "Remote"),
                        "job_type": item.get("job_type", "Full-time"),
                        "experience_level": "Mid-Level",
                        "salary_range": item.get("salary") or "$110,000 - $160,000",
                        "description": re_sub_html(desc[:300]) + "...",
                        "skills": extracted_skills,
                        "application_url": item.get("url"),
                        "is_remote": True,
                        "match_score": match_score,
                        "created_at": item.get("publication_date", "Recently")
                    })
        except Exception as e:
            print(f"Remotive Job API fetch notice: {e}")

        if not results:
            # Fallback static sample matched jobs
            fallback_jobs = [
                {
                    "id": "remotive-fb-1",
                    "title": "Senior AI & Full Stack Developer",
                    "company": "Remotive Partner Tech",
                    "location": "Global Remote",
                    "job_type": "Full-time",
                    "experience_level": "Senior",
                    "salary_range": "$135,000 - $175,000",
                    "description": "Architect async microservices, integrate Gemini LLMs, and lead React modern dashboard engineering.",
                    "skills": ["Python", "FastAPI", "React", "TypeScript", "Docker"],
                    "application_url": "https://remotive.com",
                    "is_remote": True,
                    "match_score": ai_service.calculate_match_score(candidate_skills or [], ["Python", "FastAPI", "React"]),
                    "created_at": "Today"
                },
                {
                    "id": "remotive-fb-2",
                    "title": "Backend Microservices Architect",
                    "company": "Global Cloud Software",
                    "location": "US / EU Remote",
                    "job_type": "Full-time",
                    "experience_level": "Mid-Level",
                    "salary_range": "$120,000 - $150,000",
                    "description": "Scale PostgreSQL databases, build REST/gRPC endpoints with FastAPI, and manage Kubernetes clusters.",
                    "skills": ["Python", "FastAPI", "SQL", "PostgreSQL", "Docker", "AWS"],
                    "application_url": "https://remotive.com",
                    "is_remote": True,
                    "match_score": ai_service.calculate_match_score(candidate_skills or [], ["Python", "FastAPI", "SQL"]),
                    "created_at": "Yesterday"
                }
            ]
            return fallback_jobs

        return sorted(results, key=lambda x: x["match_score"], reverse=True)

    def get_job_by_id(self, db: Session, job_id: str) -> Optional[Job]:
        return db.query(Job).filter(Job.id == job_id).first()

    def create_job(self, db: Session, job_in: JobCreate) -> Job:
        job = Job(**job_in.model_dump())
        db.add(job)
        db.commit()
        db.refresh(job)
        return job

def re_sub_html(html_str: str) -> str:
    import re
    clean = re.sub(r'<[^>]+>', '', html_str)
    return clean.strip()

job_service = JobService()
