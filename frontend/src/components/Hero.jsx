
export default function Hero({ activeTab, searchQuery, setSearchQuery, selectedFilter, setSelectedFilter, locationQuery = '', setLocationQuery, categoryQuery = '', setCategoryQuery }) {
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

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '880px', margin: '0 auto' }}>
        
        <span className="badge badge-indigo" style={{ marginBottom: '16px' }}>
          🤖 All Job Categories & Career Discovery Engine
        </span>

        <h2 style={{ fontSize: '2.6rem', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '12px' }}>
          {activeTab === 'jobs' && <>Explore <span className="gradient-text">All Kinds of Jobs</span> & Careers</>}
          {activeTab === 'matches' && <>Skill Matched <span className="gradient-text">Jobs Across All Fields</span></>}
          {activeTab === 'hackathons' && <>Compete & Win at <span className="gradient-text">Global Hackathons</span></>}
          {activeTab === 'ai' && <>AI Powered <span className="gradient-text">Resume & Skill Roadmap</span></>}
          {activeTab === 'interview' && <>Tailored <span className="gradient-text">AI Interview Practice</span></>}
        </h2>

        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '28px' }}>
          Find and apply directly to real jobs across Marketing, Sales, Design, Finance, HR, Customer Support, Writing, Operations, and Technology.
        </p>

        {/* Search, Category & Location Filter Bar */}
        {activeTab !== 'ai' && activeTab !== 'interview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '820px', margin: '0 auto' }}>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              background: 'rgba(15, 23, 42, 0.8)',
              padding: '8px 12px 8px 18px',
              borderRadius: '16px',
              border: '1px solid var(--border-glass)',
              boxShadow: 'var(--shadow-card)',
              flexWrap: 'wrap'
            }}>
              <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>🔍</span>
              <input
                type="text"
                placeholder={activeTab === 'jobs' ? "Search all jobs by title, company, skills..." : "Search hackathons by keyword, organizer, tag..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  flex: 1.5,
                  minWidth: '200px',
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit'
                }}
              />

              {/* Category Dropdown */}
              {setCategoryQuery && (
                <>
                  <div style={{ height: '24px', width: '1px', background: 'var(--border-glass)' }} />
                  <span style={{ fontSize: '1.1rem', color: '#a5b4fc' }}>📁</span>
                  <select
                    value={categoryQuery}
                    onChange={(e) => setCategoryQuery(e.target.value)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#a5b4fc',
                      border: '1px solid var(--border-glass)',
                      padding: '8px 10px',
                      borderRadius: '10px',
                      outline: 'none',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    <option value="" style={{ background: '#0f172a' }}>🌟 All Categories</option>
                    <option value="Tech" style={{ background: '#0f172a' }}>💻 Tech & Software</option>
                    <option value="Design" style={{ background: '#0f172a' }}>🎨 Design & Creative</option>
                    <option value="Marketing" style={{ background: '#0f172a' }}>📣 Marketing & Sales</option>
                    <option value="Finance" style={{ background: '#0f172a' }}>📊 Finance & Business</option>
                    <option value="Support" style={{ background: '#0f172a' }}>📞 Customer Support & HR</option>
                    <option value="Writing" style={{ background: '#0f172a' }}>✍️ Writing & Content</option>
                    <option value="Operations" style={{ background: '#0f172a' }}>⚙️ Operations</option>
                  </select>
                </>
              )}

              {/* Location Input Box */}
              {setLocationQuery && (
                <>
                  <div style={{ height: '24px', width: '1px', background: 'var(--border-glass)' }} />
                  <span style={{ fontSize: '1.1rem', color: '#6ee7b7' }}>📍</span>
                  <input
                    type="text"
                    placeholder="City, Country..."
                    value={locationQuery}
                    onChange={(e) => setLocationQuery(e.target.value)}
                    style={{
                      flex: 1,
                      minWidth: '120px',
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
                  padding: '8px 10px',
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

            {/* Quick Category Preset Pills */}
            {setCategoryQuery && (
              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>Job Fields:</span>
                {[
                  { label: '🌟 All Categories', val: '' },
                  { label: '📣 Marketing & Growth', val: 'Marketing' },
                  { label: '🎨 Design & UI/UX', val: 'Design' },
                  { label: '📊 Finance & Accounting', val: 'Finance' },
                  { label: '📞 HR & Support', val: 'Support' },
                  { label: '✍️ Writing & Content', val: 'Writing' },
                  { label: '💻 Software & Tech', val: 'Tech' }
                ].map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCategoryQuery(item.val)}
                    className={categoryQuery === item.val ? 'badge badge-emerald' : 'badge badge-indigo'}
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
