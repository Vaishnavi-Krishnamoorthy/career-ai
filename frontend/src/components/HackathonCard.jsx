
export default function HackathonCard({ hackathon }) {
  const getValidRegistrationUrl = (item) => {
    const raw = (item.registration_url || item.apply_url || item.official_link || item.url || '').trim();
    if (!raw || !raw.startsWith('http')) return null;

    const isDummy = ['techcraft.org', 'sfhackforimpact.org', 'example.com', 'localhost'].some(d => raw.includes(d));
    if (isDummy) {
      const t = (item.title || '').toLowerCase();
      if (t.includes('agent') || t.includes('ai') || t.includes('llm')) {
        return 'https://devpost.com/hackathons';
      }
      if (t.includes('eth') || t.includes('impact') || t.includes('climate')) {
        return 'https://ethglobal.com/events';
      }
      return 'https://mlh.io/seasons/2026/events';
    }
    return raw;
  };

  const validUrl = getValidRegistrationUrl(hackathon);

  return (
    <div className="glass-panel" style={{
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: '100%',
      position: 'relative'
    }}>
      <div>
        {/* Banner image or Badge header */}
        {hackathon.banner_url && (
          <div style={{
            height: '140px',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '16px',
            position: 'relative'
          }}>
            <img
              src={hackathon.banner_url}
              alt={hackathon.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              top: '10px',
              left: '10px',
              background: 'rgba(9, 13, 22, 0.85)',
              padding: '4px 10px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: '600',
              backdropFilter: 'blur(8px)'
            }}>
              {hackathon.mode === 'Online' ? '🌐 Online Global' : '📍 In-Person'}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: '600' }}>
            BY {(hackathon.organizer || 'GLOBAL GUILD').toUpperCase()}
          </span>
          <span className="badge badge-emerald">
            🏆 {hackathon.prize_pool}
          </span>
        </div>

        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '8px', color: 'var(--text-primary)' }}>
          {hackathon.title}
        </h3>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {hackathon.description}
        </p>
      </div>

      <div>
        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {(hackathon.tags || []).map((tag, idx) => (
            <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
              #{tag}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            📅 {hackathon.start_date} - {hackathon.end_date}
          </div>

          {validUrl ? (
            <button
              type="button"
              onClick={() => window.open(validUrl, '_blank', 'noopener,noreferrer')}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.85rem', textDecoration: 'none' }}
            >
              Register Now 🚀
            </button>
          ) : (
            <button
              disabled
              type="button"
              className="btn-secondary"
              style={{ opacity: 0.6, cursor: 'not-allowed', fontSize: '0.78rem', padding: '6px 10px' }}
            >
              Registration link is currently unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
