import React, { useState } from 'react';
import { createJob, createHackathon } from '../services/api';

export default function PostModal({ isOpen, onClose, onRefresh }) {
  const [postType, setPostType] = useState('job'); // 'job' or 'hackathon'
  const [loading, setLoading] = useState(false);

  // Job Form State
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    location: 'Remote',
    job_type: 'Full-time',
    salary_range: '$100k - $130k',
    description: '',
    skills: 'Python, React, FastAPI',
    application_url: 'https://example.com/apply'
  });

  // Hackathon Form State
  const [hackForm, setHackForm] = useState({
    title: '',
    organizer: '',
    mode: 'Online',
    prize_pool: '$10,000 USD',
    start_date: 'Aug 20, 2026',
    end_date: 'Aug 22, 2026',
    tags: 'AI, Web3, Hackathon',
    description: '',
    registration_url: 'https://devpost.com'
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (postType === 'job') {
        const payload = {
          ...jobForm,
          skills: jobForm.skills.split(',').map(s => s.trim()).filter(Boolean)
        };
        await createJob(payload);
      } else {
        const payload = {
          ...hackForm,
          tags: hackForm.tags.split(',').map(t => t.trim()).filter(Boolean)
        };
        await createHackathon(payload);
      }
      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating post. Please ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        width: '100%',
        maxWidth: '600px',
        padding: '32px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
            + Post Opportunity
          </h3>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-secondary)',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        {/* Toggle Type */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
          <button
            className={postType === 'job' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setPostType('job')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            💼 Post Job Opening
          </button>
          <button
            className={postType === 'hackathon' ? 'btn-primary' : 'btn-secondary'}
            onClick={() => setPostType('hackathon')}
            style={{ flex: 1, justifyContent: 'center' }}
          >
            🚀 Host Hackathon
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {postType === 'job' ? (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Job Title</label>
                <input
                  required
                  type="text"
                  value={jobForm.title}
                  onChange={e => setJobForm({ ...jobForm, title: e.target.value })}
                  placeholder="e.g. Senior AI Engineer"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Company Name</label>
                  <input
                    required
                    type="text"
                    value={jobForm.company}
                    onChange={e => setJobForm({ ...jobForm, company: e.target.value })}
                    placeholder="e.g. Acme AI"
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Location</label>
                  <input
                    required
                    type="text"
                    value={jobForm.location}
                    onChange={e => setJobForm({ ...jobForm, location: e.target.value })}
                    placeholder="e.g. Remote / San Francisco"
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Required Skills (comma-separated)</label>
                <input
                  type="text"
                  value={jobForm.skills}
                  onChange={e => setJobForm({ ...jobForm, skills: e.target.value })}
                  placeholder="Python, React, FastAPI, SQL"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Job Description</label>
                <textarea
                  required
                  rows={4}
                  value={jobForm.description}
                  onChange={e => setJobForm({ ...jobForm, description: e.target.value })}
                  placeholder="Describe key responsibilities and requirements..."
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>
            </>
          ) : (
            <>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Hackathon Title</label>
                <input
                  required
                  type="text"
                  value={hackForm.title}
                  onChange={e => setHackForm({ ...hackForm, title: e.target.value })}
                  placeholder="e.g. Autonomous AI Agents Hackathon"
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Organizer</label>
                  <input
                    required
                    type="text"
                    value={hackForm.organizer}
                    onChange={e => setHackForm({ ...hackForm, organizer: e.target.value })}
                    placeholder="e.g. BuildLab"
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Prize Pool</label>
                  <input
                    required
                    type="text"
                    value={hackForm.prize_pool}
                    onChange={e => setHackForm({ ...hackForm, prize_pool: e.target.value })}
                    placeholder="e.g. $25,000 USD"
                    style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={hackForm.description}
                  onChange={e => setHackForm({ ...hackForm, description: e.target.value })}
                  placeholder="Event summary and prize details..."
                  style={{ width: '100%', background: 'rgba(15, 23, 42, 0.8)', border: '1px solid var(--border-glass)', padding: '10px', borderRadius: '8px', color: 'white', fontFamily: 'inherit' }}
                />
              </div>
            </>
          )}

          <button
            className="btn-primary"
            type="submit"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', marginTop: '10px', padding: '12px' }}
          >
            {loading ? 'Submitting...' : 'Submit Opportunity ✨'}
          </button>
        </form>

      </div>
    </div>
  );
}
