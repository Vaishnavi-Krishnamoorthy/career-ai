export default function Navbar({
  activeTab,
  setActiveTab,
  apiStatus,
  onOpenPostModal,
  unreadCount = 0,
  onToggleNotifications
}) {
  return (
    <header className="glass-panel" style={{ margin: '16px auto', maxWidth: '1280px', padding: '14px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setActiveTab('jobs')}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'var(--gradient-brand)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            ⚡
          </div>
          <div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: 1.1 }} className="gradient-text">
              Career AI
            </h1>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
              Jobs • OCR Resume • AI Match
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '6px', borderRadius: '12px' }}>
          <button
            onClick={() => setActiveTab('jobs')}
            className={activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            💼 Jobs Search
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={activeTab === 'matches' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            🎯 Job Matches
          </button>
          <button
            onClick={() => setActiveTab('hackathons')}
            className={activeTab === 'hackathons' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            🚀 Hackathons
          </button>
          <button
            onClick={() => setActiveTab('ai')}
            className={activeTab === 'ai' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 16px', fontSize: '0.9rem' }}
          >
            ✨ AI Resume & Roadmap
          </button>
        </nav>

        {/* Right Action & Health Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Notification Bell Icon */}
          <button
            onClick={onToggleNotifications}
            className="btn-secondary"
            style={{
              position: 'relative',
              padding: '8px 12px',
              fontSize: '1.1rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title="Notifications & Job Alerts"
          >
            🔔
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ef4444',
                color: '#ffffff',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                borderRadius: '10px',
                padding: '2px 6px',
                lineHeight: 1
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            padding: '4px 10px',
            borderRadius: '20px',
            background: apiStatus === 'ok' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
            border: `1px solid ${apiStatus === 'ok' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
            color: apiStatus === 'ok' ? '#6ee7b7' : '#fcd34d'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: apiStatus === 'ok' ? '#10b981' : '#f59e0b',
              boxShadow: apiStatus === 'ok' ? '0 0 8px #10b981' : 'none'
            }} />
            Backend: {apiStatus === 'ok' ? 'Connected' : 'Standby / Fallback'}
          </div>

          <button className="btn-primary" onClick={onOpenPostModal} style={{ fontSize: '0.85rem' }}>
            + Post Opportunity
          </button>
        </div>

      </div>
    </header>
  );
}
