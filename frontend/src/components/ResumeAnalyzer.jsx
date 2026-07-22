import { useState } from 'react';
import { analyzeResume, generateRoadmap } from '../services/api';
import ResumeUploadCard from './ResumeUploadCard';

export default function ResumeAnalyzer({ onApplySkillsToFilter }) {
  const [resumeText, setResumeText] = useState('');
  const [targetRole, setTargetRole] = useState('Full Stack AI Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [roadmap, setRoadmap] = useState(null);
  const [roadmapLoading, setRoadmapLoading] = useState(false);

  const handleProfileParsed = (profile) => {
    if (profile && profile.skills && profile.skills.length > 0) {
      if (onApplySkillsToFilter) {
        onApplySkillsToFilter(profile.skills);
      }
      setResumeText(
        `Name: ${profile.full_name || ''}\nEmail: ${profile.email || ''}\nPhone: ${profile.phone || ''}\nEducation: ${profile.education || ''}\nSkills: ${(profile.skills || []).join(', ')}\nProjects: ${(profile.projects || []).join('; ')}`
      );
    }
  };

  const handleAnalyze = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    setRoadmap(null);
    try {
      const res = await analyzeResume(resumeText, targetRole);
      setResult(res);
      if (res.skills_found && res.skills_found.length > 0 && onApplySkillsToFilter) {
        onApplySkillsToFilter(res.skills_found);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!result) return;
    setRoadmapLoading(true);
    try {
      const rm = await generateRoadmap(result.skills_found, targetRole);
      setRoadmap(rm);
    } catch (err) {
      console.error(err);
    } finally {
      setRoadmapLoading(false);
    }
  };

  const sampleResume = `Jane Doe
Senior Software Engineer
Email: jane.doe@example.com | GitHub: github.com/janedoe

Summary:
Experienced developer with 4+ years building Python backends (FastAPI, Flask) and modern React frontend web applications. Expert in SQL, PostgreSQL, Docker containerization, REST APIs, and automated testing with pytest.

Skills:
Languages & Frameworks: Python, JavaScript, TypeScript, FastAPI, React, Redux, Node.js, HTML5, CSS3, SQL, Docker, Git.`;

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* 1. OCR File Drag & Drop Card */}
      <div style={{ marginBottom: '32px' }}>
        <ResumeUploadCard
          onProfileParsed={handleProfileParsed}
          onSkillsUpdated={(skills) => onApplySkillsToFilter && onApplySkillsToFilter(skills)}
        />
      </div>

      {/* 2. Text Input & Quick AI Analysis Section */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              ✨ AI Skill Gap & Career Roadmap Analyzer
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Paste your resume or bio below to extract skills, calculate job match scores, and generate custom learning roadmaps.
            </p>
          </div>

          <button
            className="btn-secondary"
            onClick={() => setResumeText(sampleResume)}
            style={{ fontSize: '0.8rem', padding: '6px 12px' }}
          >
            📋 Load Sample Resume
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Target Role / Desired Job Title:
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior AI Engineer, Full Stack Developer"
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-glass)',
                padding: '10px 14px',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            />
          </div>
        </div>

        <textarea
          rows={6}
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          placeholder="Paste your resume text, bio, or list of tech skills here..."
          style={{
            width: '100%',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid var(--border-glass)',
            padding: '14px',
            borderRadius: '12px',
            color: 'white',
            outline: 'none',
            fontFamily: 'inherit',
            fontSize: '0.95rem',
            marginBottom: '20px',
            resize: 'vertical'
          }}
        />

        <button
          className="btn-primary"
          onClick={handleAnalyze}
          disabled={loading || !resumeText.trim()}
          style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '1rem' }}
        >
          {loading ? '⚡ Analyzing Resume with AI...' : '🚀 Analyze My Resume & Match Jobs'}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px' }}>
          <div style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '16px', marginBottom: '24px' }}>
            <span className="badge badge-emerald" style={{ marginBottom: '8px' }}>
              Level: {result.experience_level}
            </span>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '6px' }}>
              Analysis for {result.extracted_name}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {result.summary}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '28px' }}>
            
            {/* Extracted Skills */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ color: '#a5b4fc', fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>
                🛠️ Extracted Skills ({result.skills_found?.length || 0})
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {result.skills_found?.map((s, idx) => (
                  <span key={idx} className="badge badge-indigo">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Strengths */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ color: '#6ee7b7', fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>
                ✅ Key Strengths
              </h4>
              <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {result.strengths?.map((str, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{str}</li>
                ))}
              </ul>
            </div>

            {/* Skill Gaps */}
            <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
              <h4 style={{ color: '#f472b6', fontSize: '1rem', fontWeight: '700', marginBottom: '12px' }}>
                🎯 Target Skill Gaps
              </h4>
              <ul style={{ paddingLeft: '18px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {result.skill_gaps?.map((gap, idx) => (
                  <li key={idx} style={{ marginBottom: '6px' }}>{gap}</li>
                ))}
              </ul>
            </div>

          </div>

          <button
            className="btn-primary"
            onClick={handleGenerateRoadmap}
            disabled={roadmapLoading}
            style={{ margin: '0 auto', display: 'flex', gap: '10px' }}
          >
            {roadmapLoading ? 'Generating Roadmap...' : `🗺️ Generate Step-by-Step Career Roadmap for ${targetRole}`}
          </button>
        </div>
      )}

      {/* Roadmap Section */}
      {roadmap && (
        <div className="glass-panel" style={{ padding: '32px' }}>
          <div style={{ textAlignment: 'center', marginBottom: '24px' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '8px' }}>
              ⏱️ Timeline: {roadmap.estimated_timeline}
            </span>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800' }}>
              Career Milestone Roadmap: <span className="gradient-text">{roadmap.target_role}</span>
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {roadmap.steps?.map((step) => (
              <div key={step.step_number} style={{
                display: 'flex',
                gap: '20px',
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '20px',
                borderRadius: '14px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--gradient-brand)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  {step.step_number}
                </div>

                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '4px' }}>
                    {step.title}
                  </h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '10px' }}>
                    {step.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Resources:</span>
                    {step.recommended_resources?.map((res, idx) => (
                      <span key={idx} className="badge badge-indigo" style={{ fontSize: '0.75rem' }}>
                        📚 {res}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
