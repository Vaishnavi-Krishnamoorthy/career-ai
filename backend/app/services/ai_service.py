import json
import re
from typing import List, Dict, Any
from app.config import settings
from app.models.schemas import ResumeAnalysisResponse, CareerRoadmapResponse, RoadmapStep

# List of common tech skills to extract via heuristic matching
COMMON_SKILLS = [
    "Python", "JavaScript", "TypeScript", "React", "Node.js", "FastAPI",
    "Docker", "Kubernetes", "AWS", "SQL", "PostgreSQL", "MongoDB",
    "GraphQL", "REST API", "Git", "CI/CD", "Machine Learning", "PyTorch",
    "TensorFlow", "TailwindCSS", "Vue.js", "Java", "C++", "Go", "Rust",
    "Next.js", "Redux", "System Design", "Microservices", "HTML", "CSS"
]

class AIService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY

    def analyze_resume(self, resume_text: str, target_role: str = None) -> ResumeAnalysisResponse:
        """
        Parses resume text using Gemini API if key is present, otherwise smart heuristic matching.
        """
        if self.api_key:
            try:
                from google import genai
                from google.genai import types
                client = genai.Client(api_key=self.api_key)
                prompt = f"""
                Analyze the following resume to extract candidate details.
                Calculate skill gaps specifically targeting the role '{target_role or "Full Stack AI Developer"}'.

                Resume:
                {resume_text}
                """
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=ResumeAnalysisResponse
                    )
                )
                text = response.text.strip()
                if text.startswith("```"):
                    start = text.find("{")
                    end = text.rfind("}")
                    if start != -1 and end != -1:
                        text = text[start:end+1]
                data = json.loads(text)
                return ResumeAnalysisResponse(**data)
            except Exception as e:
                print(f"Gemini API fallback triggered due to: {e}")

        # Smart Heuristic Parsing Fallback
        found_skills = []
        for skill in COMMON_SKILLS:
            if re.search(r'\b' + re.escape(skill) + r'\b', resume_text, re.IGNORECASE):
                found_skills.append(skill)
        
        if not found_skills:
            found_skills = ["Python", "JavaScript", "Git", "REST API"]

        # Determine experience level
        text_len = len(resume_text.split())
        years_match = re.search(r'(\d+)\+?\s*years?', resume_text, re.IGNORECASE)
        years = int(years_match.group(1)) if years_match else (3 if text_len > 150 else 1)

        if years >= 5:
            exp_level = "Senior"
        elif years >= 2:
            exp_level = "Mid-Level / Intermediate"
        else:
            exp_level = "Entry Level"

        # Determine skill gaps
        target = target_role or "AI & Full Stack Engineer"
        possible_gaps = ["Docker & Containerization", "System Design & Scalability", "CI/CD Pipeline Automation", "Kubernetes", "Cloud Services (AWS/GCP)"]
        skill_gaps = [g for g in possible_gaps if not any(s.lower() in g.lower() for s in found_skills)][:3]

        return ResumeAnalysisResponse(
            extracted_name="Developer Professional",
            skills_found=found_skills,
            experience_level=exp_level,
            strengths=[
                f"Strong foundation in {', '.join(found_skills[:3])}",
                "Proven problem-solving skills and project delivery",
                "Adaptable to modern web & API frameworks"
            ],
            skill_gaps=skill_gaps or ["System Architecture", "Advanced Cloud Deployment"],
            recommended_roles=[
                target,
                "Full Stack Developer",
                "Backend Software Engineer"
            ],
            summary=f"A capable {exp_level} developer with proficiency in {', '.join(found_skills[:4])}. Well-positioned for {target} roles with targeted skill growth."
        )

    def generate_career_roadmap(self, current_skills: List[str], target_role: str) -> CareerRoadmapResponse:
        """
        Generates a step-by-step learning roadmap for a target career role.
        """
        target = target_role or "Full Stack AI Engineer"
        steps = [
            RoadmapStep(
                step_number=1,
                title="Master Core Frameworks & API Design",
                description="Deep dive into FastAPI, Pydantic, and modern async Python architecture.",
                recommended_resources=["FastAPI Official Docs", "RealPython Backend Guide", "SQLAlchemy 2.0 Tutorial"]
            ),
            RoadmapStep(
                step_number=2,
                title="AI & LLM Integration",
                description="Learn to integrate OpenAI/Gemini APIs, vector databases (ChromaDB), and RAG pipelines.",
                recommended_resources=["LangChain / LlamaIndex Basics", "Google GenAI SDK Documentation", "Pinecone Vector Search"]
            ),
            RoadmapStep(
                step_number=3,
                title="Frontend Integration & State Management",
                description="Build responsive UI dashboards with React, TypeScript, and TailwindCSS/Vanilla CSS.",
                recommended_resources=["React Docs (beta.react.dev)", "Vite Guide", "Tailwind Component Libraries"]
            ),
            RoadmapStep(
                step_number=4,
                title="Production Deployment & Hackathon Portfolio",
                description="Containerize app with Docker, setup GitHub Actions CI/CD, and showcase in AI hackathons.",
                recommended_resources=["Docker Docs", "Render / Railway Deployment Guide", "Devpost Hackathon Listings"]
            )
        ]

        return CareerRoadmapResponse(
            target_role=target,
            estimated_timeline="8 - 12 Weeks",
            steps=steps
        )

    def calculate_match_score(self, candidate_skills: List[str], required_skills: List[str]) -> int:
        """
        Calculates a percentage match score based on candidate skills vs job requirements.
        """
        if not required_skills:
            return 85
        cand_set = {s.lower() for s in candidate_skills}
        req_set = {s.lower() for s in required_skills}
        matched = cand_set.intersection(req_set)
        score = int((len(matched) / len(req_set)) * 100)
        return max(50, min(98, score + 20 if len(matched) > 0 else 60))

ai_service = AIService()
