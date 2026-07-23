
export default function JobCard({ job, onSelect }) {
  return (
    <div
      className="glass-panel"
      onClick={() => onSelect(job)}
      style={{
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: 'pointer',
        height: '100%'
      }}
    >
      <div>
        {/* Header Badges & Score */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
          <div>
            <span className="badge badge-indigo" style={{ marginRight: '8px' }}>
              {job.job_type || 'Full-time'}
            </span>
            {job.is_remote && (
              <span className="badge badge-emerald">
                🌐 Remote
              </span>
            )}
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(6, 182, 212, 0.2) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '0.85rem',
            fontWeight: '700',
            color: '#6ee7b7'
          }}>
            🎯 {job.match_score || 85}% Match
          </div>
        </div>

        {/* Job Title & Company */}
        <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '6px', color: 'var(--text-primary)' }}>
          {job.title}
        </h3>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
          <span>🏢 {job.company}</span>
          <span>•</span>
          <span>📍 {job.location}</span>
        </div>

        {/* Description Snippet */}
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {job.description}
        </p>
      </div>

      <div>
        {/* Salary & Skills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
          {(job.skills || []).map((skill, idx) => (
            <span key={idx} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-secondary)',
              fontSize: '0.78rem',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              {skill}
            </span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
          <span style={{ fontWeight: '700', color: '#a5b4fc', fontSize: '0.95rem' }}>
            💰 {job.salary_range || 'Competitive'}
          </span>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              className="btn-secondary"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(job);
              }}
              style={{ padding: '6px 12px', fontSize: '0.82rem' }}
            >
              Details
            </button>
            <button
              className="btn-primary"
              onClick={(e) => {
                e.stopPropagation();
                let url = (job.application_url || '').trim();
                const isInvalid = !url || !url.startsWith('http') || [
                  'cognitivecloud', 'verve.tech', 'nexus-systems', 'mindlabs', 'techcraft', 'tndigital', 'apexai', 'vervesg'
                ].some(d => url.includes(d));

                if (isInvalid) {
                  const comp = (job.company || '').toLowerCase();
                  if (comp.includes('google')) url = 'https://careers.google.com';
                  else if (comp.includes('meta')) url = 'https://www.metacareers.com';
                  else if (comp.includes('amazon')) url = 'https://amazon.jobs';
                  else if (comp.includes('openai')) url = 'https://openai.com/careers';
                  else if (comp.includes('microsoft')) url = 'https://careers.microsoft.com';
                  else if (comp.includes('zoho')) url = 'https://www.zoho.com/careers/';
                  else if (comp.includes('freshworks')) url = 'https://www.freshworks.com/company/careers/';
                  else if (comp.includes('stripe')) url = 'https://stripe.com/jobs';
                  else if (comp.includes('razorpay')) url = 'https://razorpay.com/jobs/';
                  else url = 'https://remotive.com/remote-jobs';
                }

                window.open(url, '_blank', 'noopener,noreferrer');
              }}
              style={{ padding: '6px 14px', fontSize: '0.85rem' }}
            >
              Apply 🚀
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
