import { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' or 'register'
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [enableGmailAlerts, setEnableGmailAlerts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both Email and Password.');
      return;
    }

    setLoading(true);

    try {
      let session = null;
      if (mode === 'login') {
        session = await loginUser(email.trim(), password.trim());
      } else {
        if (!fullName.trim()) {
          setErrorMsg('Full Name is required for registration.');
          setLoading(false);
          return;
        }
        session = await registerUser(fullName.trim(), email.trim(), password.trim(), enableGmailAlerts);
      }

      setSuccessMsg(session.message || 'Authenticated successfully!');
      setTimeout(() => {
        if (onAuthSuccess) onAuthSuccess(session);
        onClose();
      }, 900);

    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="glass-panel" onClick={(e) => e.stopPropagation()} style={{
        maxWidth: '440px',
        width: '100%',
        margin: '0 16px',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-glow)'
      }}>
        
        {/* Header Tabs */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setMode('login')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: '800',
                color: mode === 'login' ? '#a5b4fc' : 'var(--text-muted)',
                borderBottom: mode === 'login' ? '2px solid #6366f1' : 'none',
                paddingBottom: '4px',
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              style={{
                background: 'transparent',
                border: 'none',
                fontSize: '1.2rem',
                fontWeight: '800',
                color: mode === 'register' ? '#a5b4fc' : 'var(--text-muted)',
                borderBottom: mode === 'register' ? '2px solid #6366f1' : 'none',
                paddingBottom: '4px',
                cursor: 'pointer'
              }}
            >
              Create Account
            </button>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.4rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginBottom: '20px' }}>
          {mode === 'login'
            ? 'Sign in to access your saved resume profile and active Gmail job alerts.'
            : 'Register your candidate profile to receive instant skill-matched job alerts sent to your Gmail.'}
        </p>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#fca5a5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            ⚠️ {errorMsg}
          </div>
        )}

        {successMsg && (
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.4)', color: '#6ee7b7', padding: '10px 14px', borderRadius: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
            ✓ {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {mode === 'register' && (
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Alex Morgan"
                required
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-glass)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  color: 'white',
                  outline: 'none'
                }}
              />
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Gmail / Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="candidate@gmail.com"
              required
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-glass)',
                padding: '10px 14px',
                borderRadius: '8px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px', color: 'var(--text-secondary)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-glass)',
                padding: '10px 14px',
                borderRadius: '8px',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          {mode === 'register' && (
            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)', cursor: 'pointer', marginTop: '4px' }}>
              <input
                type="checkbox"
                checked={enableGmailAlerts}
                onChange={(e) => setEnableGmailAlerts(e.target.checked)}
                style={{ accentColor: '#6366f1', width: '16px', height: '16px' }}
              />
              ✉️ Send high skill-match job alerts to my Gmail address
            </label>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.95rem', marginTop: '8px' }}
          >
            {loading ? '⚡ Authenticating...' : mode === 'login' ? '🔐 Sign In to Career AI' : '🚀 Create Account & Enable Alerts'}
          </button>
        </form>
      </div>
    </div>
  );
}
