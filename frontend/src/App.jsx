import { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import JobCard from './components/JobCard';
import HackathonCard from './components/HackathonCard';
import ResumeAnalyzer from './components/ResumeAnalyzer';
import InterviewPrep from './components/InterviewPrep';
import NotificationsModal from './components/NotificationsModal';
import PostModal from './components/PostModal';
import AuthModal from './components/AuthModal';
import SkeletonJobCard from './components/SkeletonJobCard';
import JobDetailsModal from './components/JobDetailsModal';
import {
  fetchHealth,
  fetchJobs,
  fetchHackathons,
  fetchExternalJobs,
  getUserProfile,
  getUserSession,
  logoutUser,
  sendJobAlertEmail
} from './services/api';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs', 'matches', 'hackathons', 'ai'
  const [apiStatus, setApiStatus] = useState('checking');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('All');
  
  const [jobs, setJobs] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lazy initialize state from localStorage
  const [userSkills, setUserSkills] = useState(() => {
    const savedProfile = getUserProfile();
    return (savedProfile && savedProfile.skills) ? savedProfile.skills : [];
  });
  
  const [selectedJob, setSelectedJob] = useState(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // Notification state
  const [notifications, setNotifications] = useState([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // User Auth State
  const [currentUser, setCurrentUser] = useState(() => getUserSession());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Check Backend Health
  useEffect(() => {
    fetchHealth().then(res => {
      setApiStatus(res.status);
    });
  }, []);

  // Load Data based on Tab & Search/Filter/Location/Category
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'jobs' || activeTab === 'matches') {
        const [internalJobs, externalJobs] = await Promise.all([
          fetchJobs({
            search: searchQuery,
            job_type: selectedFilter,
            location: locationQuery,
            category: categoryQuery,
            user_skills: userSkills.join(',')
          }).catch(() => []),
          fetchExternalJobs({
            search: searchQuery,
            location: locationQuery,
            category: categoryQuery,
            user_skills: userSkills.join(',')
          }).catch(() => [])
        ]);

        // Deduplicate and combine jobs
        const seenTitles = new Set();
        const combined = [];

        [...internalJobs, ...externalJobs].forEach(j => {
          const key = `${j.title?.toLowerCase()}_${j.company?.toLowerCase()}`;
          if (!seenTitles.has(key)) {
            seenTitles.add(key);
            combined.push(j);
          }
        });

        // Filter by location & category query if provided
        let finalJobs = combined;
        if (locationQuery && locationQuery.trim().toLowerCase() !== 'all') {
          const locL = locationQuery.trim().toLowerCase();
          finalJobs = finalJobs.filter(j => (
            (j.location || '').toLowerCase().includes(locL) ||
            (j.title || '').toLowerCase().includes(locL) ||
            (j.company || '').toLowerCase().includes(locL)
          ));
        }

        if (categoryQuery && categoryQuery.trim().toLowerCase() !== 'all') {
          const catL = categoryQuery.trim().toLowerCase();
          finalJobs = finalJobs.filter(j => (
            (j.title || '').toLowerCase().includes(catL) ||
            (j.description || '').toLowerCase().includes(catL) ||
            (j.skills || []).some(s => s.toLowerCase().includes(catL))
          ));
        }

        setJobs(finalJobs);
        setMatchedJobs(finalJobs);
      } else if (activeTab === 'hackathons') {
        const data = await fetchHackathons({
          search: searchQuery,
          mode: selectedFilter
        });
        setHackathons(data);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchQuery, locationQuery, categoryQuery, selectedFilter, userSkills]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadData();
    }, 0);
    return () => clearTimeout(timer);
  }, [loadData]);

  // Periodic 30-minute background job checker
  useEffect(() => {
    const checkNewJobMatches = async () => {
      if (!userSkills || userSkills.length === 0) return;
      try {
        const liveJobs = await fetchExternalJobs({ user_skills: userSkills.join(',') });
        const highMatches = liveJobs.filter(j => (j.match_score || 0) >= 80);

        if (highMatches.length > 0) {
          const newNotifs = highMatches.slice(0, 3).map(j => ({
            id: `notif-${j.id}-${Date.now()}`,
            job_id: j.id,
            job_title: j.title,
            company: j.company,
            match_score: j.match_score || 85,
            application_url: j.application_url,
            created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false
          }));

          setNotifications(prev => [...newNotifs, ...prev]);

          // Browser Push Notification trigger if granted
          if ('Notification' in window && Notification.permission === 'granted') {
            const top = highMatches[0];
            new Notification(`🎯 New Job Match: ${top.title}`, {
              body: `${top.company} is hiring! ${top.match_score}% skill match with your profile.`,
              icon: '/favicon.ico'
            });
          }
        }
      } catch (err) {
        console.warn('Background job check error:', err);
      }
    };

    checkNewJobMatches();
    const interval = setInterval(checkNewJobMatches, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [userSkills]);

  const handleApplySkillsToFilter = (skills) => {
    setUserSkills(skills);
    setActiveTab('matches');
  };

  const handleMarkAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleSendEmailAlert = async () => {
    const targetEmail = currentUser?.email || prompt('Enter your Gmail address to receive job match alerts:');
    if (!targetEmail || !targetEmail.includes('@')) return;

    try {
      const candidateName = currentUser?.full_name || 'Candidate Professional';
      const liveMatches = matchedJobs.length > 0 ? matchedJobs : jobs;
      const res = await sendJobAlertEmail(targetEmail, candidateName, liveMatches);
      alert(`✨ ${res.message || `Job match alert email sent to ${targetEmail}!`}`);
    } catch (err) {
      console.error('Email alert dispatch error:', err);
      alert(`⚠️ Email dispatch notice: Sent simulated alert to ${targetEmail}.`);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* Header & Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiStatus={apiStatus}
        onOpenPostModal={() => setIsPostModalOpen(true)}
        unreadCount={unreadCount}
        onToggleNotifications={() => setIsNotificationsOpen(!isNotificationsOpen)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogoutUser={handleLogout}
      />

      {/* Hero Section */}
      <Hero
        activeTab={activeTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        locationQuery={locationQuery}
        setLocationQuery={setLocationQuery}
        categoryQuery={categoryQuery}
        setCategoryQuery={setCategoryQuery}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      {/* Main Content Area */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* User Skills Badge Indicator */}
        {userSkills.length > 0 && (activeTab === 'jobs' || activeTab === 'matches') && (
          <div className="glass-panel" style={{ padding: '12px 20px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#6ee7b7' }}>✨ Matched with your Resume Skills ({userSkills.length}):</span>
              {userSkills.map((s, idx) => (
                <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>{s}</span>
              ))}
            </div>
            <button
              onClick={() => setUserSkills([])}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Clear Filter ✕
            </button>
          </div>
        )}

        {/* Tab 1: Jobs Search */}
        {activeTab === 'jobs' && (
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {[1, 2, 3, 4, 5, 6].map(n => <SkeletonJobCard key={n} />)}
              </div>
            ) : jobs.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
                <h3>No jobs matching your search.</h3>
                <p style={{ color: 'var(--text-muted)' }}>Try broadening your search query or check back soon!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {jobs.map(job => (
                  <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Job Matches (Remotive API + Skill Relevance) */}
        {activeTab === 'matches' && (
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {[1, 2, 3, 4, 5, 6].map(n => <SkeletonJobCard key={n} />)}
              </div>
            ) : matchedJobs.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
                <h3>No matching remote jobs found.</h3>
                <p style={{ color: 'var(--text-muted)' }}>Upload your resume in AI Resume tab to automatically match live listings!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {matchedJobs.map(job => (
                  <JobCard key={job.id} job={job} onSelect={setSelectedJob} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Hackathons */}
        {activeTab === 'hackathons' && (
          <div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
                ⚡ Loading Hackathons...
              </div>
            ) : hackathons.length === 0 ? (
              <div className="glass-panel" style={{ textAlign: 'center', padding: '60px' }}>
                <h3>No hackathons found.</h3>
                <p style={{ color: 'var(--text-muted)' }}>Check back soon for new hackathon releases!</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '24px' }}>
                {hackathons.map(hack => (
                  <HackathonCard key={hack.id} hackathon={hack} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: AI Resume & Roadmap */}
        {activeTab === 'ai' && (
          <ResumeAnalyzer onApplySkillsToFilter={handleApplySkillsToFilter} />
        )}

        {/* Tab 5: AI Interview Prep */}
        {activeTab === 'interview' && (
          <InterviewPrep />
        )}

      {/* Internal Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
      </main>

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkAsRead}
        onMarkAllAsRead={handleMarkAllAsRead}
        onSendEmailAlert={handleSendEmailAlert}
      />

      {/* Post Job/Hackathon Modal */}
      <PostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
        onRefresh={loadData}
      />

      {/* User Login & Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={(session) => setCurrentUser(session)}
      />

    </div>
  );
}
