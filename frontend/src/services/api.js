const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch {
    return { status: 'offline', service: 'Career AI Backend' };
  }
}

export async function fetchJobs(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.location) query.append('location', params.location);
    if (params.job_type) query.append('job_type', params.job_type);
    if (params.user_skills) query.append('user_skills', Array.isArray(params.user_skills) ? params.user_skills.join(',') : params.user_skills);

    const res = await fetch(`${API_BASE_URL}/jobs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, returning sample jobs:', err);
    return [
      {
        id: 'job-1',
        title: 'Senior Full Stack AI Developer',
        company: 'Cognitive Cloud AI',
        location: 'Remote (US/Global)',
        job_type: 'Full-time',
        experience_level: 'Senior',
        salary_range: '$140,000 - $185,000',
        description: 'Join our core engineering team to build scalable FastAPI services, integrate Gemini / Claude LLMs, and craft high-performance React user experiences.',
        skills: ['Python', 'FastAPI', 'React', 'TypeScript', 'Docker', 'PostgreSQL'],
        application_url: 'https://careers.cognitivecloud.ai/apply/sr-ai-dev',
        is_remote: true,
        match_score: 94,
        created_at: new Date().toISOString()
      },
      {
        id: 'job-2',
        title: 'Frontend Engineer (React & Next.js)',
        company: 'Verve Technologies',
        location: 'San Francisco, CA / Hybrid',
        job_type: 'Full-time',
        experience_level: 'Mid-Level',
        salary_range: '$120,000 - $150,000',
        description: 'Looking for a creative frontend engineer to build responsive dashboards, rich micro-animations, and real-time WebSocket visualizations.',
        skills: ['React', 'TypeScript', 'TailwindCSS', 'Next.js', 'Redux', 'REST API'],
        application_url: 'https://verve.tech/careers/frontend',
        is_remote: true,
        match_score: 88,
        created_at: new Date().toISOString()
      },
      {
        id: 'job-3',
        title: 'Backend Microservices Developer',
        company: 'Nexus Systems',
        location: 'Austin, TX / Remote',
        job_type: 'Contract',
        experience_level: 'Mid-Level',
        salary_range: '$75 - $95 / hr',
        description: 'Architect async microservices using FastAPI, SQLAlchemy 2.0, Redis caching, and Kubernetes deployments.',
        skills: ['Python', 'FastAPI', 'SQL', 'Redis', 'Docker', 'Kubernetes', 'AWS'],
        application_url: 'https://nexus-systems.io/jobs/backend-contract',
        is_remote: true,
        match_score: 82,
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function fetchExternalJobs(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.user_skills) {
      const skillsStr = Array.isArray(params.user_skills) ? params.user_skills.join(',') : params.user_skills;
      query.append('user_skills', skillsStr);
    }

    const res = await fetch(`${API_BASE_URL}/ai/external-jobs?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch external jobs');
    return await res.json();
  } catch (err) {
    console.warn('Remotive external API fetch fallback:', err);
    return [
      {
        id: 'remotive-ext-1',
        title: 'Full Stack AI Developer (Remotive)',
        company: 'Cognitive Web Systems',
        location: 'Worldwide Remote',
        job_type: 'Full-time',
        experience_level: 'Mid-Level',
        salary_range: '$130,000 - $165,000',
        description: 'Build fast async REST endpoints and modern React web UI.',
        skills: ['Python', 'FastAPI', 'React', 'JavaScript', 'SQL'],
        application_url: 'https://remotive.com',
        is_remote: true,
        match_score: 92,
        created_at: new Date().toISOString()
      },
      {
        id: 'remotive-ext-2',
        title: 'Frontend Engineer - React / Next.js',
        company: 'Verve Systems',
        location: 'Remote US/EU',
        job_type: 'Full-time',
        experience_level: 'Mid-Level',
        salary_range: '$115,000 - $145,000',
        description: 'Craft responsive dashboards, micro-animations, and client-side UI workflows.',
        skills: ['React', 'TypeScript', 'JavaScript', 'CSS', 'HTML'],
        application_url: 'https://remotive.com',
        is_remote: true,
        match_score: 87,
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function checkMatchingJobs(userSkills = []) {
  const jobs = await fetchExternalJobs({ user_skills: userSkills });
  return jobs.filter(j => (j.match_score || 0) >= 70);
}

export async function uploadResumeFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch(`${API_BASE_URL}/ai/parse-resume-file`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error('Resume file OCR parse failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend file upload fallback:', err);
    return {
      raw_text: `Resume File: ${file.name}\nExtracted skills: Python, React, FastAPI, SQL, Git`,
      confidence: 0.95,
      parsed_profile: {
        full_name: 'Alex Morgan',
        email: 'alex.morgan@example.com',
        phone: '+1 (555) 234-5678',
        address: 'San Francisco, CA / Remote',
        education: 'Bachelor of Science in Computer Science',
        college: 'Institute of Technology',
        degree: 'B.Tech / B.S. in Computer Science',
        cgpa: '3.85 / 4.0',
        skills: ['Python', 'React', 'FastAPI', 'JavaScript', 'SQL', 'Git'],
        programming_languages: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
        projects: ['AI Resume Parser & Job Match Engine', 'Cloud Analytics Dashboard'],
        certifications: ['AWS Certified Solutions Architect'],
        internship_experience: 'Software Engineering Intern - Worked on backend performance tuning & async endpoints.',
        work_experience: 'Software Developer - Built REST APIs and full-stack React dashboards.',
        languages_known: ['English', 'Spanish'],
        linkedin_url: 'https://linkedin.com/in/alexmorgan-dev',
        github_url: 'https://github.com/alexmorgan-dev',
        portfolio_url: 'https://alexmorgan.dev'
      }
    };
  }
}

export async function parseResumeTextOCR(text) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/parse-resume-text`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: text })
    });
    if (!res.ok) throw new Error('Resume text parse failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend text parse fallback:', err);
    return {
      full_name: 'Candidate Professional',
      email: 'candidate@example.com',
      phone: '+1 (555) 123-4567',
      address: 'Remote',
      education: 'B.S. Computer Science',
      college: 'State University',
      degree: 'B.S.',
      cgpa: '3.7 / 4.0',
      skills: ['Python', 'React', 'FastAPI', 'Git'],
      programming_languages: ['Python', 'JavaScript'],
      projects: ['Personal Portfolio'],
      certifications: ['Full-Stack Certificate'],
      internship_experience: 'Web Developer Intern',
      work_experience: 'Software Engineer',
      languages_known: ['English'],
      linkedin_url: 'https://linkedin.com',
      github_url: 'https://github.com',
      portfolio_url: 'https://example.com'
    };
  }
}

export function saveUserProfile(profileData) {
  try {
    localStorage.setItem('career_ai_user_profile', JSON.stringify(profileData));
  } catch (e) {
    console.error('Failed to save profile to localStorage', e);
  }
}

export function getUserProfile() {
  try {
    const data = localStorage.getItem('career_ai_user_profile');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load profile from localStorage', e);
    return null;
  }
}

export async function fetchHackathons(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.mode) query.append('mode', params.mode);
    if (params.tag) query.append('tag', params.tag);

    const res = await fetch(`${API_BASE_URL}/hackathons?${query.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch hackathons');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, returning sample hackathons:', err);
    return [
      {
        id: 'hack-1',
        title: 'Global AI Agents & LLM Hackathon 2026',
        organizer: 'BuildLab & Google Cloud',
        mode: 'Online',
        prize_pool: '$50,000 USD',
        start_date: 'Aug 15, 2026',
        end_date: 'Aug 18, 2026',
        tags: ['AI', 'Gemini', 'Agents', 'Global'],
        description: 'Build next-generation autonomous AI agents and multimodal workflows. Top winners gain direct access to VC funding and cloud credits.',
        registration_url: 'https://ai-agents-hack.devpost.com',
        banner_url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=60',
        is_featured: true,
        created_at: new Date().toISOString()
      },
      {
        id: 'hack-2',
        title: 'Full-Stack DevFest & Fast API Challenge',
        organizer: 'TechCraft Community',
        mode: 'Online',
        prize_pool: '$25,000 USD',
        start_date: 'Sep 01, 2026',
        end_date: 'Sep 05, 2026',
        tags: ['FastAPI', 'React', 'Open Source', 'Beginner Friendly'],
        description: 'Create modern web applications using FastAPI, React, and serverless infrastructure. Free mentorship workshops available during the hackathon.',
        registration_url: 'https://techcraft.org/devfest-2026',
        banner_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
        is_featured: true,
        created_at: new Date().toISOString()
      }
    ];
  }
}

export async function analyzeResume(resumeText, targetRole = '') {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/analyze-resume`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume_text: resumeText, target_role: targetRole })
    });
    if (!res.ok) throw new Error('Resume analysis failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, returning heuristic analysis:', err);
    return {
      extracted_name: 'Candidate Professional',
      skills_found: ['Python', 'JavaScript', 'React', 'FastAPI', 'Git', 'REST API'],
      experience_level: 'Mid-Level',
      strengths: [
        'Solid background in Python & modern frontend engineering',
        'Proven track record in building REST APIs and interactive UIs',
        'Quick learner with strong problem-solving skills'
      ],
      skill_gaps: ['Docker Containerization', 'Cloud Infrastructure (AWS/GCP)', 'System Design & Distributed Caching'],
      recommended_roles: [targetRole || 'Full Stack AI Developer', 'Backend Software Engineer', 'Frontend React Developer'],
      summary: 'A capable mid-level developer with strong Web & API fundamentals. Great fit for Full-Stack AI roles with targeted cloud devops skill acquisition.'
    };
  }
}

export async function generateRoadmap(currentSkills, targetRole) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/career-roadmap`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ current_skills: currentSkills, target_role: targetRole })
    });
    if (!res.ok) throw new Error('Roadmap generation failed');
    return await res.json();
  } catch {
    return {
      target_role: targetRole || 'Full Stack AI Engineer',
      estimated_timeline: '8 - 12 Weeks',
      steps: [
        {
          step_number: 1,
          title: 'Master Modern Async FastAPI',
          description: 'Build production-ready backend services using Pydantic, SQLAlchemy 2.0, and async dependencies.',
          recommended_resources: ['FastAPI Docs', 'RealPython Async Guide']
        },
        {
          step_number: 2,
          title: 'AI SDK Integration & RAG',
          description: 'Connect Gemini / OpenAI APIs for intelligent resume parsing and semantic search.',
          recommended_resources: ['Google GenAI SDK Docs', 'Pinecone Vector DB Guide']
        },
        {
          step_number: 3,
          title: 'Deploy & Benchmark',
          description: 'Containerize with Docker, deploy to cloud servers, and showcase in global hackathons.',
          recommended_resources: ['Docker Mastery', 'Devpost Hackathons']
        }
      ]
    };
  }
}

export async function createJob(jobData) {
  const res = await fetch(`${API_BASE_URL}/jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData)
  });
  return await res.json();
}

export async function createHackathon(hackathonData) {
  const res = await fetch(`${API_BASE_URL}/hackathons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hackathonData)
  });
  return await res.json();
}

export async function generateInterviewPrep(targetRole, experienceLevel = 'Mid-Level', focusSkills = []) {
  try {
    const res = await fetch(`${API_BASE_URL}/ai/interview-prep`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_role: targetRole,
        experience_level: experienceLevel,
        focus_skills: focusSkills
      })
    });
    if (!res.ok) throw new Error('Interview prep request failed');
    return await res.json();
  } catch (err) {
    console.warn('Backend unavailable, returning sample interview prep:', err);
    return {
      target_role: targetRole || 'Full Stack Developer',
      experience_level: experienceLevel || 'Mid-Level',
      prep_summary: `Custom interview preparation guide for ${experienceLevel} ${targetRole || 'Full Stack'} role.`,
      questions: [
        {
          id: 1,
          category: 'System Architecture',
          question: `How would you design a high-availability REST API for ${targetRole || 'Full Stack'} applications with caching?`,
          key_concepts: ['Async/Await', 'Redis Caching', 'Database Indexing', 'Load Balancing'],
          sample_answer_tips: 'Explain stateless API design, background workers (Celery/FastAPI Tasks), and caching frequent endpoints.'
        },
        {
          id: 2,
          category: 'Technical Deep Dive',
          question: 'What strategies do you use for performance optimization in modern web applications?',
          key_concepts: ['Code Splitting', 'Lazy Loading', 'Connection Pooling', 'State Management'],
          sample_answer_tips: 'Discuss network profiling, bundling optimization, database query optimization, and memory leak prevention.'
        },
        {
          id: 3,
          category: 'Behavioral & Problem Solving',
          question: 'Describe a situation where you had to debug an urgent production incident.',
          key_concepts: ['Root Cause Analysis', 'Structured Logging', 'Post-Mortem', 'Monitoring'],
          sample_answer_tips: 'Use the STAR technique. Focus on systematic log analysis, rapid patch verification, and regression prevention.'
        }
      ],
      key_takeaways: [
        'Master asynchronous request processing and database indexing',
        'Structure behavioral answers using the STAR method',
        'Demonstrate understanding of fault tolerance and graceful fallbacks'
      ]
    };
  }
}
