import React from 'react';

export default function Hero({ activeTab, searchQuery, setSearchQuery, selectedFilter, setSelectedFilter }) {
  return (
    <section className="glass-panel" style={{
      margin: '0 auto 28px',
      maxWidth: '1280px',
      padding: '40px 32px',
      position: 'relative',
      overflow: 'hidden',
      textAlign: 'center'
    }}>
      {/* Background glow decoration */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none',
        filter: 'blur(40px)'
      }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
        
        <span className="badge badge-indigo" style={{ marginBottom: '16px' }}>
          🤖 Next-Gen AI Career Discovery Engine
        </span>

        <h2 style={{ fontSize: '2.6rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '12px' }}>
          {activeTab === 'jobs' && <>Find Your Dream <span className="gradient-text">AI & Tech Role</span></>}
          {activeTab === 'hackathons' && <>Compete & Win at <span className="gradient-text">Global Hackathons</span></>}
          {activeTab === 'ai' && <>AI Powered <span className="gradient-text">Resume & Skill Roadmap</span></>}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '28px' }}>
          Match your skills directly with high-impact job opportunities, curated global hackathons, and personalized step-by-step career acceleration.
        </p>

        {/* Global Search Input */}
        {activeTab !== 'ai' && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'rgba(15, 23, 42, 0.8)',
            padding: '8px 12px 8px 20px',
            borderRadius: '16px',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-card)',
            maxWidth: '680px',
            margin: '0 auto'
          }}>
            <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>🔍</span>
            <input
              type="text"
              placeholder={activeTab === 'jobs' ? "Search jobs by title, skills (Python, React, FastAPI)..." : "Search hackathons by keyword, organizer, tag..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
            />

            {/* Filter Pills */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-glass)',
                padding: '8px 14px',
                borderRadius: '10px',
                outline: 'none',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              <option value="All" style={{ background: '#0f172a' }}>All Types</option>
              {activeTab === 'jobs' ? (
                <>
                  <option value="Full-time" style={{ background: '#0f172a' }}>Full-time</option>
                  <option value="Contract" style={{ background: '#0f172a' }}>Contract</option>
                  <option value="Internship" style={{ background: '#0f172a' }}>Internship</option>
                </>
              ) : (
                <>
                  <option value="Online" style={{ background: '#0f172a' }}>Online</option>
                  <option value="In-Person" style={{ background: '#0f172a' }}>In-Person</option>
                </>
              )}
            </select>
          </div>
        )}

      </div>
    </section>
  );
}
