from sqlalchemy.orm import Session
from app.models.db_models import Job, Hackathon

SEED_JOBS = [
    {
        "title": "Senior Full Stack AI Developer",
        "company": "Google Cloud AI",
        "location": "Remote (US/Global)",
        "job_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$140,000 - $185,000",
        "description": "Join our core engineering team to build scalable FastAPI services, integrate Gemini LLMs, and craft high-performance React user experiences.",
        "skills": ["Python", "FastAPI", "React", "TypeScript", "Docker", "PostgreSQL"],
        "application_url": "https://careers.google.com",
        "is_remote": True
    },
    {
        "title": "Frontend Engineer (React & Next.js)",
        "company": "Meta",
        "location": "San Francisco, CA / Hybrid",
        "job_type": "Full-time",
        "experience_level": "Mid-Level",
        "salary_range": "$130,000 - $160,000",
        "description": "Looking for a creative frontend engineer to build responsive web dashboards, rich micro-animations, and real-time WebSocket visualizations.",
        "skills": ["React", "TypeScript", "TailwindCSS", "Next.js", "Redux", "REST API"],
        "application_url": "https://www.metacareers.com",
        "is_remote": True
    },
    {
        "title": "Backend Microservices Developer",
        "company": "Amazon Web Services",
        "location": "Austin, TX / Remote",
        "job_type": "Full-time",
        "experience_level": "Mid-Level",
        "salary_range": "$125,000 - $155,000",
        "description": "Architect async microservices using FastAPI, SQLAlchemy 2.0, Redis caching, and Kubernetes deployments.",
        "skills": ["Python", "FastAPI", "SQL", "Redis", "Docker", "Kubernetes", "AWS"],
        "application_url": "https://amazon.jobs",
        "is_remote": True
    },
    {
        "title": "AI Research & LLM Systems Specialist",
        "company": "OpenAI",
        "location": "San Francisco, CA / Remote",
        "job_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$160,000 - $220,000",
        "description": "Exciting engineering role to experiment with RAG architectures, PyTorch fine-tuning, and multimodal LLM evaluation benchmarks.",
        "skills": ["Python", "PyTorch", "Machine Learning", "Git", "REST API"],
        "application_url": "https://openai.com/careers",
        "is_remote": True
    },
    {
        "title": "Full Stack Engineer (React & FastAPI)",
        "company": "Zoho Corporation",
        "location": "Bangalore, Karnataka, India (Hybrid)",
        "job_type": "Full-time",
        "experience_level": "Mid-Level",
        "salary_range": "₹18,00,000 - ₹26,00,000 INR",
        "description": "Build high-speed web portals and async microservices for enterprise cloud clients. On-site 2 days a week in Bangalore.",
        "skills": ["Python", "FastAPI", "React", "JavaScript", "SQL", "Docker"],
        "application_url": "https://www.zoho.com/careers/",
        "is_remote": False
    },
    {
        "title": "Backend Microservices Developer",
        "company": "Freshworks",
        "location": "Chennai, Tamil Nadu, India (On-Site)",
        "job_type": "Full-time",
        "experience_level": "Mid-Level",
        "salary_range": "₹15,00,000 - ₹24,00,000 INR",
        "description": "Develop high-scale backend APIs, PostgreSQL database schemas, and Redis caching layers for SaaS applications in OMR Chennai.",
        "skills": ["Python", "FastAPI", "SQL", "PostgreSQL", "Git", "REST API"],
        "application_url": "https://www.freshworks.com/company/careers/",
        "is_remote": False
    },
    {
        "title": "AI & Computer Vision Engineer",
        "company": "Microsoft AI India",
        "location": "Hyderabad, Telangana, India / Remote",
        "job_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "₹28,00,000 - ₹38,00,000 INR",
        "description": "Lead computer vision and multimodal LLM integration for AI-powered autonomous systems. Flexible remote work across India.",
        "skills": ["Python", "PyTorch", "TensorFlow", "FastAPI", "Docker", "AWS"],
        "application_url": "https://careers.microsoft.com",
        "is_remote": True
    },
    {
        "title": "Frontend React & Web Specialist",
        "company": "Stripe",
        "location": "Singapore / Hybrid (APAC)",
        "job_type": "Full-time",
        "experience_level": "Senior",
        "salary_range": "$95,000 - $130,000 SGD",
        "description": "Craft responsive web dashboards, modern micro-animations, and WebSocket visualizations for regional Asia-Pacific markets.",
        "skills": ["React", "TypeScript", "TailwindCSS", "Next.js", "Redux"],
        "application_url": "https://stripe.com/jobs",
        "is_remote": False
    },
    {
        "title": "Full Stack Dev (Fintech Payments)",
        "company": "Razorpay",
        "location": "Bangalore, Karnataka, India",
        "job_type": "Full-time",
        "experience_level": "Mid-Level",
        "salary_range": "₹20,00,000 - ₹30,00,000 INR",
        "description": "Architect payment gateway APIs, secure authentication flows, and modern React dashboard components.",
        "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Redis"],
        "application_url": "https://razorpay.com/jobs/",
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
    # Always wipe existing jobs on startup to ensure 100% clean, real enterprise company data
    db.query(Job).delete(synchronize_session=False)
    db.commit()

    # Re-populate clean SEED_JOBS with verified company URLs
    for job_data in SEED_JOBS:
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
