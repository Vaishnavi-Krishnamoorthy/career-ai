import { useState, useEffect } from 'react';

export default function NotificationsModal({ isOpen, onClose, notifications, onMarkAsRead, onMarkAllAsRead, onSendEmailAlert }) {
  const [pushPermission, setPushPermission] = useState('default');

  useEffect(() => {
    if ('Notification' in window) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPushPermission(Notification.permission);
    }
  }, []);

  const requestPushPermission = async () => {
    if (!('Notification' in window)) {
      alert('Browser push notifications are not supported on this device/browser.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setPushPermission(permission);
      if (permission === 'granted') {
        new Notification('🎯 Career AI Notifications Enabled', {
          body: 'You will receive instant alerts when new remote jobs match your resume skills!',
          icon: '/favicon.ico'
        });
      }
    } catch (err) {
      console.error('Error requesting push permission:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="notifications-modal card-glass" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header flex-between align-center border-bottom-subtle padding-bottom-sm margin-bottom-md">
          <div className="header-title-group flex-gap-xs align-center">
            <span className="text-xl">🔔</span>
            <div>
              <h3 className="font-bold text-lg text-primary">Job Alerts & Matches</h3>
              <p className="text-xs text-secondary">Real-time skill matching push notification alerts</p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>

        {/* Browser Push Permission Status Banner */}
        <div className="push-permission-card margin-bottom-md padding-sm flex-between align-center card-subtle">
          <div className="flex-gap-xs align-center">
            <span className="text-sm">🌐</span>
            <div>
              <p className="text-xs font-semibold text-primary">Browser Push Alerts</p>
              <p className="text-xs text-secondary">
                Status: <span className={`font-bold ${pushPermission === 'granted' ? 'text-success' : 'text-warning'}`}>{pushPermission.toUpperCase()}</span>
              </p>
            </div>
          </div>
          {pushPermission !== 'granted' && (
            <button onClick={requestPushPermission} className="btn-secondary text-xs">
              Enable Push Alerts
            </button>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex-between align-center margin-bottom-sm">
          <span className="text-xs text-secondary font-medium">
            {notifications.filter(n => !n.read).length} Unread Alerts
          </span>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {onSendEmailAlert && (
              <button onClick={onSendEmailAlert} className="btn-secondary text-xs" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                ✉️ Email to Gmail
              </button>
            )}
            {notifications.length > 0 && (
              <button onClick={onMarkAllAsRead} className="btn-link text-xs">
                Mark All as Read
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="notifications-list scrollable-area">
          {notifications.length === 0 ? (
            <div className="empty-state text-center padding-xl">
              <span className="text-2xl">🎉</span>
              <p className="text-sm font-semibold margin-top-xs">No New Notifications</p>
              <p className="text-xs text-secondary">You are all caught up with job match alerts!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`notification-card padding-sm margin-bottom-xs card-subtle ${!n.read ? 'unread-card border-accent-left' : ''}`}
                onClick={() => onMarkAsRead && onMarkAsRead(n.id)}
              >
                <div className="flex-between align-center">
                  <div className="flex-gap-xs align-center">
                    <span className="badge-score text-xs font-bold">{n.match_score}% Match</span>
                    <h4 className="font-bold text-sm text-primary">{n.job_title}</h4>
                  </div>
                  <span className="text-xs text-secondary">{n.created_at || 'Just now'}</span>
                </div>
                <p className="text-xs text-secondary margin-top-xs">
                  Company: <span className="font-medium text-primary">{n.company}</span>
                </p>
                <div className="flex-between align-center margin-top-xs">
                  <span className="text-xs text-secondary">Matching your extracted resume skills</span>
                  {n.application_url && (
                    <a
                      href={n.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary text-xs padding-xs"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Apply Now ↗
                    </a>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
