import pytest
from fastapi.testclient import TestClient
from app.main import app

def test_root_endpoint():
    with TestClient(app) as client:
        response = client.get("/")
        assert response.status_code == 200
        data = response.json()
        assert "message" in data
        assert data["docs"] == "/docs"

def test_health_check():
    with TestClient(app) as client:
        response = client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "ok"
        assert "database" in data

def test_list_jobs():
    with TestClient(app) as client:
        response = client.get("/api/v1/jobs")
        assert response.status_code == 200
        jobs = response.json()
        assert isinstance(jobs, list)
        assert len(jobs) > 0
        assert "title" in jobs[0]
        assert "skills" in jobs[0]

def test_create_and_get_job():
    with TestClient(app) as client:
        new_job = {
            "title": "Automated Test Engineer",
            "company": "TestCorp",
            "location": "Remote",
            "job_type": "Full-time",
            "experience_level": "Mid-Level",
            "salary_range": "$110,000 - $130,000",
            "description": "Test job for Pytest validation.",
            "skills": ["Python", "Pytest", "FastAPI"],
            "application_url": "https://testcorp.com/apply",
            "is_remote": True
        }
        post_res = client.post("/api/v1/jobs", json=new_job)
        assert post_res.status_code == 201
        created_job = post_res.json()
        assert created_job["title"] == "Automated Test Engineer"

        # Get single job
        get_res = client.get(f"/api/v1/jobs/{created_job['id']}")
        assert get_res.status_code == 200
        assert get_res.json()["company"] == "TestCorp"

def test_list_hackathons():
    with TestClient(app) as client:
        response = client.get("/api/v1/hackathons")
        assert response.status_code == 200
        hacks = response.json()
        assert isinstance(hacks, list)
        assert len(hacks) > 0
        assert "prize_pool" in hacks[0]

def test_ai_resume_analysis():
    with TestClient(app) as client:
        payload = {
            "resume_text": "Experienced Python Developer with 4 years of expertise in React, FastAPI, SQL, Docker, and Git. Built web apps and microservices.",
            "target_role": "Senior Full Stack Engineer"
        }
        response = client.post("/api/v1/ai/analyze-resume", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "skills_found" in data
        assert "Python" in data["skills_found"]
        assert "experience_level" in data
        assert "summary" in data

def test_ai_career_roadmap():
    with TestClient(app) as client:
        payload = {
            "current_skills": ["Python", "JavaScript"],
            "target_role": "AI Solutions Architect"
        }
        response = client.post("/api/v1/ai/career-roadmap", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["target_role"] == "AI Solutions Architect"
        assert len(data["steps"]) > 0

def test_ai_parse_resume_text():
    with TestClient(app) as client:
        payload = {
            "resume_text": "Alex Morgan\nalex.morgan@example.com\nPhone: +1 555-0199\nEducation: B.Tech in Computer Science at MIT, CGPA 3.9\nSkills: Python, JavaScript, React, FastAPI, SQL, Git, Docker."
        }
        response = client.post("/api/v1/ai/parse-resume-text", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["full_name"] is not None
        assert data["email"] == "alex.morgan@example.com"
        assert "Python" in data["skills"]
        assert data["cgpa"] is not None

def test_ai_parse_resume_file():
    with TestClient(app) as client:
        fake_file = ("resume.pdf", b"%PDF-1.4 Fake PDF content for testing OCR parse", "application/pdf")
        response = client.post("/api/v1/ai/parse-resume-file", files={"file": fake_file})
        assert response.status_code == 200
        data = response.json()
        assert "raw_text" in data
        assert "parsed_profile" in data
        assert isinstance(data["parsed_profile"]["skills"], list)

def test_external_jobs():
    with TestClient(app) as client:
        response = client.get("/api/v1/ai/external-jobs?user_skills=Python,React")
        assert response.status_code == 200
        jobs = response.json()
        assert isinstance(jobs, list)
        assert len(jobs) > 0
        assert "match_score" in jobs[0]

def test_ai_interview_prep():
    with TestClient(app) as client:
        payload = {
            "target_role": "Lead Full Stack Developer",
            "experience_level": "Senior",
            "focus_skills": ["FastAPI", "React", "Docker"]
        }
        response = client.post("/api/v1/ai/interview-prep", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["target_role"] == "Lead Full Stack Developer"
        assert data["experience_level"] == "Senior"
        assert len(data["questions"]) > 0
        assert "key_concepts" in data["questions"][0]

def test_ai_interview_prep_validation():
    with TestClient(app) as client:
        payload = {
            "target_role": "",
            "experience_level": "Mid-Level"
        }
        response = client.post("/api/v1/ai/interview-prep", json=payload)
        assert response.status_code == 400

def test_auth_login_and_register():
    with TestClient(app) as client:
        payload = {
            "full_name": "Test User",
            "email": "test.user@example.com",
            "password": "securepassword123",
            "enable_gmail_alerts": True
        }
        reg_res = client.post("/api/v1/auth/register", json=payload)
        assert reg_res.status_code == 200
        data = reg_res.json()
        assert data["email"] == "test.user@example.com"
        assert "token" in data

        login_res = client.post("/api/v1/auth/login", json={"email": "test.user@example.com", "password": "securepassword123"})
        assert login_res.status_code == 200
        assert "token" in login_res.json()

def test_send_email_alert():
    with TestClient(app) as client:
        payload = {
            "recipient_email": "candidate@example.com",
            "candidate_name": "Alex Candidate",
            "matched_jobs": [
                {
                    "id": "remotive-1",
                    "title": "Senior AI Developer",
                    "company": "Cognitive Tech",
                    "match_score": 94,
                    "salary_range": "$140,000",
                    "application_url": "https://example.com"
                }
            ]
        }
        response = client.post("/api/v1/ai/send-email-alert", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        assert data["recipient"] == "candidate@example.com"

def test_evaluate_interview():
    with TestClient(app) as client:
        payload = {
            "target_role": "Senior Full Stack Engineer",
            "experience_level": "Senior",
            "qa_pairs": [
                {
                    "question_id": 1,
                    "question": "How do you design scalable async APIs?",
                    "category": "System Architecture",
                    "spoken_answer": "I use FastAPI with Pydantic and async await routines, combined with Redis caching and PostgreSQL connection pooling to ensure high throughput."
                }
            ]
        }
        response = client.post("/api/v1/ai/evaluate-interview", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert "overall_score" in data
        assert "pros" in data
        assert "cons" in data
        assert "areas_for_improvement" in data


