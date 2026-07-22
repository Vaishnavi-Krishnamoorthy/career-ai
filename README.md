# ⚡ Career AI - AI-Powered Job Search, Hackathon Discovery & Resume Guidance

> An intelligent platform for tech professionals, students, and job seekers to match skills with active developer openings, discover global hackathons, analyze resumes, and generate step-by-step career roadmaps.

---

## ✨ Features

- **💼 Job Search & Matching Engine**: Filter tech jobs by keyword, skills, remote/onsite mode, and salary range with real-time candidate skill match percentage scoring.
- **🚀 Hackathon Discovery**: Curation of global online and in-person hackathons filterable by mode, prize pool, and tech tags (AI, Web3, FastAPI, Open Source).
- **📄 AI Resume Analyzer**: Paste resume text to extract skills, experience levels, key strengths, and role gap analysis.
- **🗺️ Interactive Career Roadmap**: Automatically generates step-by-step learning milestones and curated resources for desired target roles.
- **🛡️ Multi-Tiered AI Service**: Native support for **Google Gemini API** (`google-genai`) with fallback heuristic analysis when offline.

---

## 🛠️ Technology Stack

- **Backend**: Python 3.13, FastAPI 0.115+, Uvicorn, SQLAlchemy 2.0+, Pydantic v2, Pytest, SQLite.
- **Frontend**: React 18, Vite, Modern Vanilla CSS (Glassmorphism design system, dark mode, responsive layout).
- **APIs**: RESTful JSON architecture with OpenAPI / Swagger integration (`/docs`).

---

## 📁 Repository Structure

```
career-ai/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI application entrypoint & CORS
│   │   ├── config.py            # Environment & app configuration
│   │   ├── database.py          # SQLite database connection & session maker
│   │   ├── seed.py              # Initial dataset for jobs & hackathons
│   │   ├── models/              # SQLAlchemy ORM models & Pydantic schemas
│   │   ├── routers/             # API route handlers (/jobs, /hackathons, /ai, /health)
│   │   └── services/            # Business logic & AI parser engine
│   ├── tests/                   # Automated pytest API test suite
│   ├── requirements.txt         # Python dependencies
│   └── .env.example             # Environment configuration sample
│
└── frontend/
    ├── src/
    │   ├── components/          # React UI components (Navbar, Hero, JobCard, etc.)
    │   ├── services/api.js      # API client connected to FastAPI backend
    │   ├── App.jsx              # Tabbed application workspace
    │   └── index.css            # Dark mode glassmorphism styling
    ├── index.html
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+
- Node.js 18+ and npm

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn app.main:app --reload --port 8000
```
- **Interactive API Documentation**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check**: [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

### 3. Frontend Setup
```bash
# Open a new terminal in the frontend directory
cd frontend

# Install Node modules
npm install

# Start Vite development server
npm run dev
```
- Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 🧪 Running Automated Tests

```bash
cd backend
python -m pytest tests/
```

---

## 🌐 API Endpoints Overview

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/health` | Server & Database health status |
| `GET` | `/api/v1/jobs` | List & filter jobs with match scores |
| `POST` | `/api/v1/jobs` | Create/post a new job listing |
| `GET` | `/api/v1/hackathons` | Discover & filter hackathons |
| `POST` | `/api/v1/hackathons` | Host/submit a new hackathon |
| `POST` | `/api/v1/ai/analyze-resume` | Extract skills, gaps, & strengths from resume |
| `POST` | `/api/v1/ai/career-roadmap` | Generate step-by-step learning roadmap |

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for details.
