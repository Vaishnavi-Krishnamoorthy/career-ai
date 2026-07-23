export default function JobDetailsModal({ job, onClose }) {
  if (!job) return null;

  // Resolve direct official company URL
  const getDirectApplyUrl = (targetJob) => {
    let url = (targetJob.application_url || '').trim();
    const isInvalid = !url || !url.startsWith('http') || [
      'cognitivecloud', 'verve.tech', 'nexus-systems', 'mindlabs', 'techcraft', 'tndigital', 'apexai', 'vervesg'
    ].some(d => url.includes(d));

    if (isInvalid) {
      const comp = (targetJob.company || '').toLowerCase();
      if (comp.includes('google')) return 'https://careers.google.com';
      if (comp.includes('meta')) return 'https://www.metacareers.com';
      if (comp.includes('amazon')) return 'https://amazon.jobs';
      if (comp.includes('openai')) return 'https://openai.com/careers';
      if (comp.includes('microsoft')) return 'https://careers.microsoft.com';
      if (comp.includes('zoho')) return 'https://www.zoho.com/careers/';
      if (comp.includes('freshworks')) return 'https://www.freshworks.com/company/careers/';
      if (comp.includes('stripe')) return 'https://stripe.com/jobs';
      if (comp.includes('razorpay')) return 'https://razorpay.com/jobs/';
      if (comp.includes('hubspot')) return 'https://www.hubspot.com/careers';
      if (comp.includes('figma')) return 'https://www.figma.com/careers/';
      if (comp.includes('deloitte')) return 'https://www2.deloitte.com/global/en/careers.html';
      if (comp.includes('workday')) return 'https://www.workday.com/en-us/company/careers.html';
      if (comp.includes('salesforce')) return 'https://www.salesforce.com/company/careers/';
      if (comp.includes('zendesk')) return 'https://www.zendesk.com/careers/';
      if (comp.includes('notion')) return 'https://www.notion.so/careers';
      if (comp.includes('airbnb')) return 'https://careers.airbnb.com/';
      return 'https://remotive.com/remote-jobs';
    }
    return url;
  };

  const applyUrl = getDirectApplyUrl(job);
  const companyInitial = (job.company || 'C')[0].toUpperCase();

  return (
    <div className="modal-backdrop" onClick={onClose} style={{ zIndex: 1100 }}>
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '90%',
          maxWidth: '740px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '32px',
          borderRadius: '24px',
          border: '1px solid var(--border-glass)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
          position: 'relative'
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-secondary)',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            fontSize: '1.1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          ✕
        </button>

        {/* 1. Header with Company Logo & AI Match Score */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            fontWeight: '800',
            color: '#fff',
            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)',
            flexShrink: 0
          }}>
            {companyInitial}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
              <span className="badge badge-indigo" style={{ fontSize: '0.8rem' }}>
                🏢 {job.company}
              </span>
              <span className="badge badge-emerald" style={{ fontSize: '0.8rem' }}>
                {job.is_remote ? '🌐 Remote' : '🏢 On-Site / Hybrid'}
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                🕒 Posted {job.created_at || 'Recently'}
              </span>
            </div>

            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0' }}>
              {job.title}
            </h2>
          </div>
        </div>

        {/* 2. AI Resume Match Percentage Card */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.15) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          padding: '14px 20px',
          borderRadius: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6ee7b7', marginBottom: '2px' }}>
              🎯 AI Skill Match Score
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Based on your parsed resume skills & target qualifications
            </div>
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#6ee7b7' }}>
            {job.match_score || 85}%
          </div>
        </div>

        {/* 3. Job Metadata Grid (Location, Employment Type, Salary, Remote Status) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '12px',
          marginBottom: '24px',
          background: 'rgba(15, 23, 42, 0.6)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid var(--border-glass)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>LOCATION</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>📍 {job.location}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>EMPLOYMENT TYPE</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-primary)' }}>💼 {job.job_type || 'Full-time'}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>SALARY RANGE</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#a5b4fc' }}>💰 {job.salary_range || 'Competitive'}</span>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>WORK MODE</span>
            <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6ee7b7' }}>{job.is_remote ? '🌐 Remote' : '🏢 On-site'}</span>
          </div>
        </div>

        {/* 4. Required Skills Chips */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-secondary)' }}>
            🛠️ Required Skills & Technologies:
          </h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {(job.skills || []).map((skill, idx) => (
              <span key={idx} style={{
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.3)',
                color: '#a5b4fc',
                fontSize: '0.82rem',
                fontWeight: '600',
                padding: '6px 12px',
                borderRadius: '8px'
              }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* 5. Full Job Description */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px', color: 'var(--text-secondary)' }}>
            📝 Full Job Description:
          </h4>
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-glass)',
            padding: '20px',
            borderRadius: '16px',
            fontSize: '0.92rem',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            whiteSpace: 'pre-line'
          }}>
            {job.description}
          </div>
        </div>

        {/* 6. Prominent Official Apply CTA Button */}
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
          <a
            href={applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{
              width: '100%',
              justify: 'center',
              padding: '16px',
              fontSize: '1.05rem',
              fontWeight: '700',
              textDecoration: 'none',
              borderRadius: '14px',
              boxShadow: '0 10px 25px rgba(99, 102, 241, 0.4)'
            }}
          >
            Apply on Official Website 🚀
          </a>
        </div>
      </div>
    </div>
  );
}
