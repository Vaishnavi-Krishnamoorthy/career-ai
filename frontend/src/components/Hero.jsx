
export default function Hero({ activeTab, searchQuery, setSearchQuery, selectedFilter, setSelectedFilter, locationQuery = '', setLocationQuery }) {
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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '850px', margin: '0 auto' }}>
        
        <span className="badge badge-indigo" style={{ marginBottom: '16px' }}>
          🤖 Next-Gen AI Career Discovery Engine
        </span>

        <h2 style={{ fontSize: '2.6rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '12px' }}>
          {activeTab === 'jobs' && <>Find Nearby & Global <span className="gradient-text">AI & Tech Roles</span></>}
          {activeTab === 'matches' && <>Skill Matched <span className="gradient-text">Regional & Remote Jobs</span></>}
          {activeTab === 'hackathons' && <>Compete & Win at <span className="gradient-text">Global Hackathons</span></>}
          {activeTab === 'ai' && <>AI Powered <span className="gradient-text">Resume & Skill Roadmap</span></>}
          {activeTab === 'interview' && <>Tailored <span className="gradient-text">AI Interview Practice</span></>}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '28px' }}>
          Match your skills directly with high-impact job opportunities nearby or remote, curated global hackathons, and personalized step-by-step career acceleration.
        </p>

        {/* Search & Location Filter Bar */}
        {activeTab !== 'ai' && activeTab !== 'interview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '780px', margin: '0 auto' }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '8px 12px 8px 20px',
              borderRadius: '16px',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-card)'
            }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>🔍</span>
              <input
                type="text"
                placeholder={activeTab === 'jobs' ? "Search jobs by title, skills (Python, React, FastAPI)..." : "Search hackathons by keyword, organizer, tag..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1.5,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
              />

              {/* Location Input Box */}
              {setLocationQuery && (
                <>
                  <div style={{ height: '24px', width: '1px', background: 'var(--border-glass)' }} />
                  <span style={{ fontSize: '1.1rem', color: '#6ee7b7' }}>📍</span>
                  <input
                    type="text"
                    placeholder="City, India, UK, Hybrid..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#6ee7b7',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit'
                    }}
                  />
                </>
              )}

              {/* Filter Dropdown */}
              <select
                value={selectedFilter}
                onChange={(e) => setSelectedFilter(e.target.value)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border-glass)',
                  padding: '8px 12px',
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

            {/* Quick Location Preset Pills */}
            {setLocationQuery && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>Regions:</span>
                {[
                  { label: '🌏 All Locations', val: '' },
                  { label: '🇮🇳 India / Asia', val: 'India' },
                  { label: '🏢 Bangalore / Chennai', val: 'Bangalore' },
                  { label: '🇪🇺 Europe / UK', val: 'Europe' },
                  { label: '🇺🇸 US / Americas', val: 'US' },
                  { label: '🏢 Hybrid & On-Site', val: 'Hybrid' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLocationQuery(item.val)}
                    className={locationQuery === item.val ? 'badge badge-emerald' : 'badge badge-indigo'}
                    style={{ cursor: 'pointer', border: 'none' }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
