import { useState, useRef } from 'react';
import { uploadResumeFile, saveUserProfile } from '../services/api';

export default function ResumeUploadCard({ onProfileParsed, onSkillsUpdated }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepIndex, setStepIndex] = useState(0); // 0: Idle, 1: Extracting, 2: Identifying, 3: Success
  const [profile, setProfile] = useState(null);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  const fileInputRef = useRef(null);

  const steps = [
    { label: 'Upload Document', icon: '📄' },
    { label: 'Extracting Resume Text (OCR)', icon: '🔍' },
    { label: 'Identifying 18 Profile Fields & Skills', icon: '🤖' },
    { label: 'Profile Generated Successfully', icon: '✨' }
  ];

  const compressImage = (imageFile) => {
    return new Promise((resolve) => {
      const img = new Image();
      const reader = new FileReader();
      reader.onload = (e) => {
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let width = img.width;
          let height = img.height;
          if (width > height && width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            resolve(new File([blob], imageFile.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.85);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(imageFile);
    });
  };

  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!validTypes.includes(selectedFile.type) && !selectedFile.name.endsWith('.pdf')) {
      alert('Please select a JPG, PNG image or PDF document.');
      return;
    }

    let processedFile = selectedFile;
    if (selectedFile.type.startsWith('image/')) {
      try {
        processedFile = await compressImage(selectedFile);
      } catch (err) {
        console.warn('Image compression bypassed:', err);
      }
    }

    processResumeOCR(processedFile);
  };

  const processResumeOCR = async (targetFile) => {
    setIsProcessing(true);
    setStepIndex(1); // Step 1: Extracting

    try {
      setTimeout(() => {
        setStepIndex(2);
      }, 1200);

      const res = await uploadResumeFile(targetFile);

      setTimeout(() => {
        setStepIndex(3);
        setIsProcessing(false);
        if (res && res.parsed_profile) {
          setProfile(res.parsed_profile);
          if (onProfileParsed) onProfileParsed(res.parsed_profile);
          if (onSkillsUpdated && res.parsed_profile.skills) {
            onSkillsUpdated(res.parsed_profile.skills);
          }
          saveUserProfile(res.parsed_profile);
        }
      }, 2200);

    } catch (err) {
      console.error('OCR Processing error:', err);
      setIsProcessing(false);
      setStepIndex(0);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFieldChange = (field, value) => {
    setProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddSkill = () => {
    if (!newSkillInput.trim() || !profile) return;
    const updatedSkills = [...(profile.skills || []), newSkillInput.trim()];
    setProfile(prev => ({ ...prev, skills: updatedSkills }));
    setNewSkillInput('');
    if (onSkillsUpdated) onSkillsUpdated(updatedSkills);
  };

  const handleRemoveSkill = (skillToRemove) => {
    if (!profile) return;
    const updatedSkills = (profile.skills || []).filter(s => s !== skillToRemove);
    setProfile(prev => ({ ...prev, skills: updatedSkills }));
    if (onSkillsUpdated) onSkillsUpdated(updatedSkills);
  };

  const handleSaveProfile = () => {
    if (!profile) return;
    saveUserProfile(profile);
    setSaveSuccessMsg('Profile saved to local storage & job recommendation engine!');
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  return (
    <div className="resume-upload-card card-glass padding-lg font-sans">
      <div className="header-flex margin-bottom-md">
        <div>
          <h2 className="title-gradient font-bold text-xl">📄 Resume OCR Parser & Profile Extractor</h2>
          <p className="text-secondary text-sm">Upload your resume (JPG, PNG, PDF) to automatically parse 18 structured fields & skills.</p>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      {!profile && !isProcessing && (
        <div
          className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden-input"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          <div className="dropzone-content">
            <span className="dropzone-icon">📥</span>
            <p className="font-semibold text-primary">Drag & Drop Resume File Here</p>
            <p className="text-secondary text-xs margin-top-xs">Supports JPG, JPEG, PNG, or Scanned PDF files</p>
            <button className="btn-secondary margin-top-sm" type="button">Select File from Computer</button>
          </div>
        </div>
      )}

      {/* Progress Animation Bar */}
      {isProcessing && (
        <div className="ocr-progress-container margin-y-md card-subtle padding-md">
          <div className="progress-steps-flex">
            {steps.map((s, idx) => (
              <div key={idx} className={`step-item ${idx <= stepIndex ? 'step-active' : ''}`}>
                <div className="step-badge">{s.icon}</div>
                <span className="step-label text-xs font-medium">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="animated-progress-bar margin-top-md">
            <div
              className="progress-fill"
              style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-center text-accent font-semibold text-sm margin-top-sm animate-pulse">
            {steps[stepIndex]?.label}...
          </p>
        </div>
      )}

      {/* Extracted 18-Field Profile Form */}
      {profile && !isProcessing && (
        <div className="extracted-profile-section margin-top-md">
          <div className="flex-between margin-bottom-sm align-center">
            <span className="badge-success text-xs font-bold">✓ 18 Profile Fields Extracted</span>
            <div className="action-buttons-gap">
              <button onClick={handleSaveProfile} className="btn-primary text-xs">💾 Save Profile</button>
              <button onClick={() => onSkillsUpdated && onSkillsUpdated(profile.skills || [])} className="btn-secondary text-xs">🎯 View Matched Jobs ➔</button>
              <button onClick={() => { setProfile(null); setStepIndex(0); }} className="btn-outline text-xs">🔄 Re-upload</button>
            </div>
          </div>

          {saveSuccessMsg && (
            <div className="alert-success-banner text-xs font-medium margin-bottom-sm">
              {saveSuccessMsg}
            </div>
          )}

          <div className="grid-2-col gap-sm margin-top-sm">
            <div className="form-group">
              <label className="form-label text-xs font-semibold">1. Full Name</label>
              <input
                className="input-field text-sm"
                value={profile.full_name || ''}
                onChange={(e) => handleFieldChange('full_name', e.target.value)}
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">2. Email Address</label>
              <input
                className="input-field text-sm"
                value={profile.email || ''}
                onChange={(e) => handleFieldChange('email', e.target.value)}
                placeholder="alex.morgan@example.com"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">3. Phone Number</label>
              <input
                className="input-field text-sm"
                value={profile.phone || ''}
                onChange={(e) => handleFieldChange('phone', e.target.value)}
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">4. Location / Address</label>
              <input
                className="input-field text-sm"
                value={profile.address || ''}
                onChange={(e) => handleFieldChange('address', e.target.value)}
                placeholder="San Francisco, CA / Remote"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">5. Education</label>
              <input
                className="input-field text-sm"
                value={profile.education || ''}
                onChange={(e) => handleFieldChange('education', e.target.value)}
                placeholder="Bachelor of Science in Computer Science"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">6. College / University</label>
              <input
                className="input-field text-sm"
                value={profile.college || ''}
                onChange={(e) => handleFieldChange('college', e.target.value)}
                placeholder="Institute of Technology"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">7. Degree</label>
              <input
                className="input-field text-sm"
                value={profile.degree || ''}
                onChange={(e) => handleFieldChange('degree', e.target.value)}
                placeholder="B.Tech / B.S. CS"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">8. CGPA / GPA</label>
              <input
                className="input-field text-sm"
                value={profile.cgpa || ''}
                onChange={(e) => handleFieldChange('cgpa', e.target.value)}
                placeholder="3.85 / 4.0"
              />
            </div>
          </div>

          {/* Field 9: Skills List with Pills & Add/Remove */}
          <div className="form-group margin-top-md">
            <label className="form-label text-xs font-semibold">9. Extracted Tech Skills ({profile.skills?.length || 0})</label>
            <div className="skills-chip-container margin-y-xs">
              {(profile.skills || []).map((skill, sIdx) => (
                <span key={sIdx} className="skill-chip text-xs">
                  {skill}
                  <button type="button" className="chip-remove-btn" onClick={() => handleRemoveSkill(skill)}>×</button>
                </span>
              ))}
            </div>
            <div className="add-skill-inline flex-gap-xs margin-top-xs">
              <input
                className="input-field text-xs flex-1"
                placeholder="Add new skill..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
              />
              <button type="button" onClick={handleAddSkill} className="btn-secondary text-xs">+ Add Skill</button>
            </div>
          </div>

          {/* Fields 10 - 18 */}
          <div className="grid-2-col gap-sm margin-top-md">
            <div className="form-group">
              <label className="form-label text-xs font-semibold">10. Programming Languages</label>
              <input
                className="input-field text-sm"
                value={Array.isArray(profile.programming_languages) ? profile.programming_languages.join(', ') : profile.programming_languages || ''}
                onChange={(e) => handleFieldChange('programming_languages', e.target.value.split(',').map(s => s.trim()))}
                placeholder="Python, JavaScript, SQL"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">11. Key Projects</label>
              <input
                className="input-field text-sm"
                value={Array.isArray(profile.projects) ? profile.projects.join('; ') : profile.projects || ''}
                onChange={(e) => handleFieldChange('projects', e.target.value.split(';').map(s => s.trim()))}
                placeholder="AI Resume Parser; Cloud Dashboard"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">12. Certifications</label>
              <input
                className="input-field text-sm"
                value={Array.isArray(profile.certifications) ? profile.certifications.join(', ') : profile.certifications || ''}
                onChange={(e) => handleFieldChange('certifications', e.target.value.split(',').map(s => s.trim()))}
                placeholder="AWS Developer, Kubernetes Cert"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">13. Internship Experience</label>
              <input
                className="input-field text-sm"
                value={profile.internship_experience || ''}
                onChange={(e) => handleFieldChange('internship_experience', e.target.value)}
                placeholder="Frontend Intern at Tech Labs"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">14. Work Experience</label>
              <input
                className="input-field text-sm"
                value={profile.work_experience || ''}
                onChange={(e) => handleFieldChange('work_experience', e.target.value)}
                placeholder="Software Developer (2 years)"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">15. Languages Known</label>
              <input
                className="input-field text-sm"
                value={Array.isArray(profile.languages_known) ? profile.languages_known.join(', ') : profile.languages_known || ''}
                onChange={(e) => handleFieldChange('languages_known', e.target.value.split(',').map(s => s.trim()))}
                placeholder="English, Spanish"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">16. LinkedIn URL</label>
              <input
                className="input-field text-sm"
                value={profile.linkedin_url || ''}
                onChange={(e) => handleFieldChange('linkedin_url', e.target.value)}
                placeholder="https://linkedin.com/in/username"
              />
            </div>
            <div className="form-group">
              <label className="form-label text-xs font-semibold">17. GitHub URL</label>
              <input
                className="input-field text-sm"
                value={profile.github_url || ''}
                onChange={(e) => handleFieldChange('github_url', e.target.value)}
                placeholder="https://github.com/username"
              />
            </div>
            <div className="form-group col-span-2">
              <label className="form-label text-xs font-semibold">18. Portfolio URL</label>
              <input
                className="input-field text-sm"
                value={profile.portfolio_url || ''}
                onChange={(e) => handleFieldChange('portfolio_url', e.target.value)}
                placeholder="https://portfolio.dev"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
