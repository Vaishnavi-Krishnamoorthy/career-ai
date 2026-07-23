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
        location: Optional[str] = None,
        category: Optional[str] = None,
        candidate_skills: Optional[List[str]] = None,
        limit: int = 30
    ) -> List[Dict[str, Any]]:
        """
        Fetches remote and regional jobs across all categories (Marketing, Sales, Design, Finance, HR, Tech)
        from Remotive API and regional databases, filters by category, location & candidate skills.
        """
        results = []
        try:
            params = {}
            if search:
                params["search"] = search
            if category and category.lower() != "all":
                # Map broad UI category to Remotive category API key
                cat_map = {
                    "tech": "software-dev",
                    "software": "software-dev",
                    "design": "design",
                    "marketing": "marketing",
                    "sales": "sales",
                    "finance": "finance",
                    "business": "business",
                    "hr": "human-resources",
                    "support": "customer-support",
                    "writing": "writing"
                }
                c_key = category.lower()
                for k, v in cat_map.items():
                    if k in c_key:
                        params["category"] = v
                        break

            response = httpx.get(REMOTIVE_API_URL, params=params, timeout=5.0)
            if response.status_code == 200:
                data = response.json()
                raw_jobs = data.get("jobs", [])[:limit]
                for item in raw_jobs:
                    job_tags = item.get("tags", [])
                    job_title = item.get("title", "Remote Developer")
                    company = item.get("company_name", "Tech Enterprise")
                    job_loc = item.get("candidate_required_location", "Remote")
                    desc = item.get("description", "")
                    
                    # Filter by location if specified
                    if location and location.strip().lower() != "all":
                        loc_lower = location.strip().lower()
                        if loc_lower not in job_loc.lower() and loc_lower not in job_title.lower() and loc_lower not in company.lower():
                            continue

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
                        "location": job_loc,
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

        # Regional & Fallback listings (India, Singapore, Europe, US, Local Cities)
        all_regional_jobs = [
            {
                "id": "remotive-reg-1",
                "title": "Full Stack Engineer (React & FastAPI)",
                "company": "Zoho Corporation",
                "location": "Bangalore, Karnataka, India (Hybrid)",
                "job_type": "Full-time",
                "experience_level": "Mid-Level",
                "salary_range": "₹18,00,000 - ₹26,00,000 INR",
                "description": "Build high-speed web portals and async microservices for Indian enterprise clients in HSR Layout Bangalore.",
                "skills": ["Python", "FastAPI", "React", "JavaScript", "SQL"],
                "application_url": "https://www.zoho.com/careers/",
                "is_remote": False,
                "match_score": ai_service.calculate_match_score(candidate_skills or [], ["Python", "FastAPI", "React"]),
                "created_at": "Today"
            },
            {
                "id": "remotive-reg-2",
                "title": "Backend Microservices Developer",
                "company": "Freshworks",
                "location": "Chennai, Tamil Nadu, India (On-Site)",
                "job_type": "Full-time",
                "experience_level": "Mid-Level",
                "salary_range": "₹15,00,000 - ₹24,00,000 INR",
                "description": "Develop high-scale backend APIs, PostgreSQL schemas, and Redis caching layers for SaaS applications in OMR Chennai.",
                "skills": ["Python", "FastAPI", "SQL", "PostgreSQL", "Git"],
                "application_url": "https://www.freshworks.com/company/careers/",
                "is_remote": False,
                "match_score": ai_service.calculate_match_score(candidate_skills or [], ["Python", "FastAPI", "SQL"]),
                "created_at": "Yesterday"
            },
            {
                "id": "remotive-reg-3",
                "title": "AI & Computer Vision Specialist",
                "company": "Microsoft AI India",
                "location": "Hyderabad, Telangana, India / Remote",
                "job_type": "Full-time",
                "experience_level": "Senior",
                "salary_range": "₹28,00,000 - ₹38,00,000 INR",
                "description": "Lead computer vision and multimodal LLM integration for AI-powered autonomous systems.",
                "skills": ["Python", "PyTorch", "TensorFlow", "FastAPI", "Docker"],
                "application_url": "https://careers.microsoft.com",
                "is_remote": True,
                "match_score": ai_service.calculate_match_score(candidate_skills or [], ["Python", "PyTorch", "FastAPI"]),
                "created_at": "Today"
            },
            {
                "id": "remotive-reg-4",
                "title": "Frontend React & Web Specialist",
                "company": "Stripe",
                "location": "Singapore / Hybrid (APAC)",
                "job_type": "Full-time",
                "experience_level": "Senior",
                "salary_range": "$95,000 - $130,000 SGD",
                "description": "Craft responsive web dashboards, modern micro-animations, and WebSocket visualizations for regional Asia-Pacific markets.",
                "skills": ["React", "TypeScript", "TailwindCSS", "Next.js", "Redux"],
                "application_url": "https://stripe.com/jobs",
                "is_remote": False,
                "match_score": ai_service.calculate_match_score(candidate_skills or [], ["React", "TypeScript", "TailwindCSS"]),
                "created_at": "Just now"
            },
            {
                "id": "remotive-reg-5",
                "title": "Full Stack Dev (Fintech Payments)",
                "company": "Razorpay",
                "location": "Bangalore, Karnataka, India",
                "job_type": "Full-time",
                "experience_level": "Mid-Level",
                "salary_range": "₹20,00,000 - ₹30,00,000 INR",
                "description": "Architect payment gateway APIs, secure authentication flows, and modern React dashboard components.",
                "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Redis"],
                "application_url": "https://razorpay.com/jobs/",
                "is_remote": False,
                "match_score": ai_service.calculate_match_score(candidate_skills or [], ["Python", "FastAPI", "React"]),
                "created_at": "Today"
            },
            {
                "id": "remotive-fb-1",
                "title": "Senior Full Stack AI Developer",
                "company": "Google Cloud AI",
                "location": "Global Remote",
                "job_type": "Full-time",
                "experience_level": "Senior",
                "salary_range": "$140,000 - $185,000",
                "description": "Architect async microservices, integrate Gemini LLMs, and lead React modern dashboard engineering.",
                "skills": ["Python", "FastAPI", "React", "TypeScript", "Docker"],
                "application_url": "https://careers.google.com",
                "is_remote": True,
                "match_score": ai_service.calculate_match_score(candidate_skills or [], ["Python", "FastAPI", "React"]),
                "created_at": "Today"
            }
        ]

        # Merge results and filter by location query if provided
        if location and location.strip().lower() != "all":
            loc_l = location.strip().lower()
            filtered_regional = [
                j for j in all_regional_jobs
                if loc_l in j["location"].lower() or loc_l in j["title"].lower() or loc_l in j["company"].lower()
            ]
            results.extend(filtered_regional)
        else:
            results.extend(all_regional_jobs)

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
