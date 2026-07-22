import { useState } from 'react';
import { generateInterviewPrep } from '../services/api';

export default function InterviewPrep() {
  const [targetRole, setTargetRole] = useState('Full Stack AI Developer');
  const [experienceLevel, setExperienceLevel] = useState('Mid-Level');
  const [skillsInput, setSkillsInput] = useState('Python, FastAPI, React, Docker');
  const [loading, setLoading] = useState(false);
  const [prepData, setPrepData] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

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

  return (
    <div className="interview-prep-container">
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

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? '⚡ Generating AI Questions...' : '🚀 Generate Interview Questions'}
          </button>
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

          <h3 className="section-title">🧠 Customized Interview Questions ({prepData.questions.length})</h3>

          <div className="questions-grid">
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
