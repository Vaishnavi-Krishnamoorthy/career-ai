import { useState } from 'react';
import { generateInterviewPrep } from '../services/api';
import LiveInterviewSimulator from './LiveInterviewSimulator';

export default function InterviewPrep() {
  const [targetRole, setTargetRole] = useState('Full Stack AI Developer');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [skillsInput, setSkillsInput] = useState('Python, FastAPI, React, Docker');
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  // View Mode: 'guide' or 'simulator'
  const [viewMode, setViewMode] = useState('guide');

  const defaultQuestions = [
    {
      id: 1,
      category: 'System Architecture',
      question: `How would you design a scalable microservices architecture for ${targetRole} with async request processing?`,
      key_concepts: ['Async/Await', 'Redis Caching', 'Database Indexing', 'Load Balancing']
    },
    {
      id: 2,
      category: 'Technical Deep Dive',
      question: 'Describe your approach to performance optimization and database query latency tuning under high load.',
      key_concepts: ['Query Optimization', 'Connection Pooling', 'State Management', 'Lazy Loading']
    },
    {
      id: 3,
      category: 'Behavioral & Problem Solving',
      question: 'Can you describe a challenging technical production incident you encountered and how you diagnosed the root cause?',
      key_concepts: ['STAR Method', 'Root Cause Analysis', 'Structured Logging', 'Post-Mortem']
    },
    {
      id: 4,
      category: 'AI & API Integration',
      question: 'How do you handle rate limits, fallback strategies, and response parsing when integrating third-party AI LLM services?',
      key_concepts: ['Circuit Breakers', 'Exponential Backoff', 'Pydantic Schemas', 'Graceful Fallbacks']
    }
  ];

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!targetRole.trim()) return;

    setLoading(true);
    const skillsList = skillsInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const res = await generateInterviewPrep(targetRole, experienceLevel, skillsList);
      setPrepData(res);
      if (res.questions && res.questions.length > 0) {
        setExpandedId(res.questions[0].id);
      }
    } catch (err) {
      console.error('Failed to generate interview prep:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleAnswer = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const activeQuestions = prepData?.questions?.length > 0 ? prepData.questions : defaultQuestions;

  if (viewMode === 'simulator') {
    return (
      <LiveInterviewSimulator
        targetRole={targetRole}
        experienceLevel={experienceLevel}
        questions={activeQuestions}
        onBack={() => setViewMode('guide')}
      />
    );
  }

  return (
    <div className="interview-prep-container">
      
      {/* View Mode Toggle Bar */}
      <div className="glass-panel" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setViewMode('guide')}
            className={viewMode === 'guide' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            📋 Question & Answer Guide
          </button>
          <button
            onClick={() => setViewMode('simulator')}
            className={viewMode === 'simulator' ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '0.85rem', padding: '6px 14px' }}
          >
            🎥 Live WebCam AI Simulator
          </button>
        </div>

        <button
          onClick={() => setViewMode('simulator')}
          className="btn-primary"
          style={{ fontSize: '0.85rem', padding: '6px 14px', background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)' }}
        >
          🎥 Launch Live Camera Room ➔
        </button>
      </div>

      <div className="glass-card prep-header">
        <h2>🎯 AI Interview Practice & Preparation</h2>
        <p>Generate role-specific technical questions, system architecture scenarios, and sample response strategies tailored to your experience level.</p>
        
        <form onSubmit={handleGenerate} className="prep-form">
          <div className="form-group">
            <label>Target Role</label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Senior Backend Engineer"
              required
            />
          </div>

          <div className="form-group">
            <label>Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            >
              <option value="Entry Level">Entry Level (0-2 YOE)</option>
              <option value="Mid-Level">Mid-Level (2-5 YOE)</option>
              <option value="Senior">Senior / Tech Lead (5+ YOE)</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Focus Skills (comma-separated)</label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="e.g. Python, FastAPI, React, SQL"
            />
          </div>

          <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} style={{ flex: 1, justifyContent: 'center' }}>
              {loading ? '⚡ Generating AI Questions...' : '🚀 Generate Interview Questions'}
            </button>

            <button
              type="button"
              onClick={() => setViewMode('simulator')}
              className="btn btn-secondary"
              style={{ flex: 1, justifyContent: 'center', background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: 'white' }}
            >
              🎥 Start Live WebCam Interview ➔
            </button>
          </div>
        </form>
      </div>

      {prepData && (
        <div className="prep-results">
          <div className="glass-card prep-summary-card">
            <h3>📌 Guide Overview</h3>
            <p className="summary-text">{prepData.prep_summary}</p>
            {prepData.key_takeaways && prepData.key_takeaways.length > 0 && (
              <div className="takeaways-section">
                <h4>💡 Key Preparation Takeaways</h4>
                <ul>
                  {prepData.key_takeaways.map((item, idx) => (
                    <li key={idx}>✅ {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            <h3 className="section-title">🧠 Customized Interview Questions ({prepData.questions.length})</h3>
            <button onClick={() => setViewMode('simulator')} className="btn-primary text-xs" style={{ padding: '6px 12px' }}>
              🎥 Test Answers Live on Camera ➔
            </button>
          </div>

          <div className="questions-grid" style={{ marginTop: '12px' }}>
            {prepData.questions.map((q) => {
              const isOpen = expandedId === q.id;
              return (
                <div key={q.id} className={`glass-card question-card ${isOpen ? 'active' : ''}`}>
                  <div className="question-header" onClick={() => toggleAnswer(q.id)}>
                    <span className="category-badge">{q.category}</span>
                    <h4 className="question-text">Q{q.id}: {q.question}</h4>
                    <button className="toggle-btn" aria-label="Toggle answer tips">
                      {isOpen ? '▲ Hide Tips' : '▼ View Sample Tips'}
                    </button>
                  </div>

                  <div className="concepts-list">
                    <strong>Key Concepts:</strong>
                    {q.key_concepts.map((concept, cIdx) => (
                      <span key={cIdx} className="concept-tag">{concept}</span>
                    ))}
                  </div>

                  {isOpen && (
                    <div className="answer-tips">
                      <h5>💡 Sample Response Strategy & Answer Tips:</h5>
                      <p>{q.sample_answer_tips}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

