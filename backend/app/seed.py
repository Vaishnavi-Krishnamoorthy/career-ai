from sqlalchemy.orm import Session
from app.models.db_models import Job, Hackathon

SEED_JOBS = [
    {
        "title": "Senior Full Stack AI Developer",
        "company": "Cognitive Cloud AI",
        "location": "Remote (US/Global)",
        "job_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$140,000 - $185,000",
        "description": "Join our core engineering team to build scalable FastAPI services, integrate Gemini / Claude LLMs, and craft high-performance React user experiences.",
        "skills": ["Python", "FastAPI", "React", "TypeScript", "Docker", "PostgreSQL"],
        "application_url": "https://careers.cognitivecloud.ai/apply/sr-ai-dev",
        "is_remote": True
    },
    {
        "title": "Frontend Engineer (React & Next.js)",
        "company": "Verve Technologies",
        "location": "San Francisco, CA / Hybrid",
        "job_type": "Full-time",
        "experience_level": "Mid-Level",
        "salary_range": "$120,000 - $150,000",
        "description": "Looking for a creative frontend engineer to build responsive dashboards, rich micro-animations, and real-time WebSocket visualizations.",
        "skills": ["React", "TypeScript", "TailwindCSS", "Next.js", "Redux", "REST API"],
        "application_url": "https://verve.tech/careers/frontend",
        "is_remote": True
    },
    {
        "title": "Backend Microservices Developer",
        "company": "Nexus Systems",
        "location": "Austin, TX / Remote",
        "job_type": "Contract",
        "experience_level": "Mid-Level",
        "salary_range": "$75 - $95 / hr",
        "description": "Architect async microservices using FastAPI, SQLAlchemy 2.0, Redis caching, and Kubernetes deployments.",
        "skills": ["Python", "FastAPI", "SQL", "Redis", "Docker", "Kubernetes", "AWS"],
        "application_url": "https://nexus-systems.io/jobs/backend-contract",
        "is_remote": True
    },
    {
        "title": "AI Research & Systems Intern",
        "company": "Mind Labs AI",
        "location": "Boston, MA",
        "job_type": "Internship",
        "experience_level": "Entry",
        "salary_range": "$40 - $55 / hr",
        "description": "Exciting internship opportunity for students and recent grads to experiment with RAG architectures, PyTorch fine-tuning, and LLM evaluation benchmarks.",
        "skills": ["Python", "PyTorch", "Machine Learning", "Git", "REST API"],
        "application_url": "https://mindlabs.ai/internships",
        "is_remote": False
    },
    {
        "title": "Full Stack Engineer (React & FastAPI)",
        "company": "TechCraft India",
        "location": "Bangalore, Karnataka, India (Hybrid)",
        "job_type": "Full-time",
        "experience_level": "Mid-Level",
        "salary_range": "₹18,00,000 - ₹26,00,000 INR",
        "description": "Build high-speed web portals and async microservices for Indian enterprise clients. On-site 2 days a week in HSR Layout, Bangalore.",
        "skills": ["Python", "FastAPI", "React", "JavaScript", "SQL", "Docker"],
        "application_url": "https://techcraft.in/careers",
        "is_remote": False
    },
    {
        "title": "Backend Microservices Developer",
        "company": "TamilNadu Digital Systems",
        "location": "Chennai, Tamil Nadu, India (On-Site)",
        "job_type": "Full-time",
        "experience_level": "Mid-Level",
        "salary_range": "₹14,00,000 - ₹22,00,000 INR",
        "description": "Develop high-scale backend APIs, PostgreSQL database schemas, and Redis caching layers for fintech applications in OMR Chennai.",
        "skills": ["Python", "FastAPI", "SQL", "PostgreSQL", "Git", "REST API"],
        "application_url": "https://tndigital.in/jobs/chennai-backend",
        "is_remote": False
    },
    {
        "title": "AI & Computer Vision Engineer",
        "company": "Apex AI Systems",
        "location": "Hyderabad, Telangana, India / Remote",
        "job_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "₹28,00,000 - ₹38,00,000 INR",
        "description": "Lead computer vision and multimodal LLM integration for AI-powered autonomous systems. Flexible remote work across India.",
        "skills": ["Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "AWS"],
        "application_url": "https://apexai.co.in/careers",
        "is_remote": True
    },
    {
        "title": "Frontend React & Web Specialist",
        "company": "Verve Singapore Tech",
        "location": "Singapore / Hybrid (APAC)",
        "job_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$90,000 - $125,000 SGD",
        "description": "Craft responsive web dashboards, modern micro-animations, and WebSocket visualizations for regional Asia-Pacific markets.",
        "skills": ["React", "TypeScript", "TailwindCSS", "Next.js", "Redux"],
        "application_url": "https://vervesg.tech/careers",
        "is_remote": False
    }
]

SEED_HACKATHONS = [
    {
        "title": "Global AI Agents & LLM Hackathon 2026",
        "organizer": "BuildLab & Google Cloud",
        "mode": "Online",
        "prize_pool": "$50,000 USD",
        "start_date": "Aug 15, 2026",
        "end_date": "Aug 18, 2026",
        "tags": ["AI", "Gemini", "Agents", "Global"],
        "description": "Build next-generation autonomous AI agents and multimodal workflows. Top winners gain direct access to VC funding and cloud credits.",
        "registration_url": "https://ai-agents-hack.devpost.com",
        "banner_url": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60",
        "is_featured": True
    },
    {
        "title": "Full-Stack DevFest & Fast API Challenge",
        "organizer": "TechCraft Community",
        "mode": "Online",
        "prize_pool": "$25,000 USD",
        "start_date": "Sep 01, 2026",
        "end_date": "Sep 05, 2026",
        "tags": ["FastAPI", "React", "Open Source", "Beginner Friendly"],
        "description": "Create modern web applications using FastAPI, React, and serverless infrastructure. Free mentorship workshops available during the hackathon.",
        "registration_url": "https://techcraft.org/devfest-2026",
        "banner_url": "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60",
        "is_featured": True
    },
    {
        "title": "Silicon Valley Hack-for-Impact",
        "organizer": "Innovation Guild SF",
        "mode": "In-Person",
        "prize_pool": "$30,000 USD",
        "start_date": "Sep 20, 2026",
        "end_date": "Sep 22, 2026",
        "tags": ["In-Person", "Social Good", "HealthTech", "Climate"],
        "description": "48-hour in-person hackathon in San Francisco focused on solving urgent challenges in climate tech, healthcare access, and education.",
        "registration_url": "https://sfhackforimpact.org",
        "banner_url": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=60",
        "is_featured": False
    }
]

def seed_database(db: Session):
    # Ensure all SEED_JOBS are present in SQLite DB
    for job_data in SEED_JOBS:
        existing = db.query(Job).filter(Job.title == job_data["title"], Job.company == job_data["company"]).first()
        if not existing:
            job = Job(**job_data)
            db.add(job)
    db.commit()

    # Ensure all SEED_HACKATHONS are present in SQLite DB
    for hack_data in SEED_HACKATHONS:
        existing = db.query(Hackathon).filter(Hackathon.title == hack_data["title"]).first()
        if not existing:
            hack = Hackathon(**hack_data)
            db.add(hack)
    db.commit()
    print("Database seeded with regional jobs and hackathons!")
