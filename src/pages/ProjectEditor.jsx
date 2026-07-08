import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/ProjectEditor.css';

// SVG Icon Component definitions to match ProjectDetail
function SecurityShieldIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    </svg>
  );
}

function AiScannerIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2"></path>
      <path d="M17 3h2a2 2 0 0 1 2 2v2"></path>
      <path d="M21 17v2a2 2 0 0 1-2 2h-2"></path>
      <path d="M7 21H5a2 2 0 0 1-2-2v-2"></path>
      <circle cx="12" cy="12" r="3"></circle>
      <line x1="3" y1="12" x2="21" y2="12"></line>
    </svg>
  );
}

function MriHeartbeatIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
    </svg>
  );
}

function EducationIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"></path>
    </svg>
  );
}

function VrHeadsetIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 14l-.5-3.5A2 2 0 0 1 5.5 8h13a2 2 0 0 1 2 2.5L20 14"></path>
      <path d="M4 14v4a2 2 0 0 0 2 2h3l2-3h2l2 3h3a2 2 0 0 0 2-2v-4"></path>
      <line x1="9" y1="14" x2="15" y2="14"></line>
    </svg>
  );
}

function RoleplayIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  );
}

function SafetyVrIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      <line x1="12" y1="8" x2="12" y2="16"></line>
      <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
  );
}

const getIconComponent = (iconName) => {
  const mapping = {
    SecurityShieldIcon,
    AiScannerIcon,
    MriHeartbeatIcon,
    EducationIcon,
    VrHeadsetIcon,
    RoleplayIcon,
    SafetyVrIcon,
  };
  return mapping[iconName] || SecurityShieldIcon;
};

const PRESET_COLORS = [
  '#0d9488', // Teal
  '#7c3aed', // Violet
  '#059669', // Green
  '#0284c7', // Blue
  '#ea580c', // Orange
  '#db2777', // Pink
  '#14b8a6', // Mint
];

const DETAIL_VIEW_OPTIONS = [
  {
    value: '',
    label: 'None - simple portfolio card only',
    description: 'No expanded detail template will open from the portfolio card.',
  },
  {
    value: 'isArast',
    label: 'ARAST - Security Training',
    description: 'ARAST (SSG-funded AR Incident Simulation & Analytics Dashboard)',
  },
  {
    value: 'isAra',
    label: 'ARA - Risk Assessment',
    description: 'ARA (Automated Risk Assessment Photo Hazard Scanner)',
  },
  {
    value: 'isMri',
    label: 'MRI - Patient Acclimatisation',
    description: 'MRI (Patient VR Acclimatisation System & Suitability Score)',
  },
  {
    value: 'isOral',
    label: 'Oral Exam - AI Practice',
    description: 'Oral Exam (Secondary School English AI Practice Environment)',
  },
  {
    value: 'isPolite',
    label: 'POLITE - Workplace Safety',
    description: 'POLITE (Immersive Ladder/Fire/Hazard Workplace Safety Package)',
  },
  {
    value: 'isRoleplay',
    label: 'Roleplay - AI Assessment',
    description: 'Roleplay (AI-Assisted Assessment & Conversation Intents platform)',
  },
  {
    value: 'isSafetyVR',
    label: 'SafetyVR - Patient Safety',
    description: 'SafetyVR (CGH Emergency Department Patient Safety Training)',
  },
];

const DETAIL_VIEW_FLAGS = DETAIL_VIEW_OPTIONS
  .map((option) => option.value)
  .filter(Boolean);

const getProjectDetailOption = (project) =>
  DETAIL_VIEW_OPTIONS.find((option) => option.value && project?.[option.value]) || DETAIL_VIEW_OPTIONS[0];

// demo.json historically held a single demo object; newer saves hold an array.
const normalizeDemos = (data) => {
  if (Array.isArray(data)) return data.filter((d) => d && typeof d === 'object');
  if (data && typeof data === 'object') return [data];
  return [];
};

// Display numbers always follow the list order (01, 02, ...).
const renumberProjects = (list) =>
  list.map((proj, idx) => ({ ...proj, number: String(idx + 1).padStart(2, '0') }));

const createNewDemo = () => ({
  title: 'New Featured Demo',
  subtitle: 'Short one-line description of this demo',
  videoSrc: '',
  howItWorksTitle: 'How it works',
  description: 'Describe what the viewer experiences in this demo...',
  highlights: [
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' },
    { value: '', label: '' },
  ],
  avatar: {
    projectName: 'NewDemo',
    projectTitle: 'New Featured Demo',
    customPrompt: 'Explain this featured demo in an engaging way...',
  },
  tags: [],
});

export default function ProjectEditor() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [originalProjects, setOriginalProjects] = useState([]);
  const [demos, setDemos] = useState([]);
  const [originalDemos, setOriginalDemos] = useState([]);
  const [activeDemoIndex, setActiveDemoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('portfolio'); // 'portfolio' or 'demo'
  const [showPreview, setShowPreview] = useState(false);
  const [previewTab, setPreviewTab] = useState('visual'); // 'visual' or 'diff'
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });

  // Security Check & Data Fetch
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token || token !== 'admin-session-token') {
      navigate('/OurProjects/ProjectDetail');
      return;
    }

    Promise.all([
      fetch('/projects.json').then((res) => res.json()),
      fetch('/demo.json')
        .then((res) => res.json())
        .catch((err) => {
          console.warn('Failed to load demo.json in editor, using default parameters', err);
          return null;
        })
    ])
      .then(([projectsData, demoJsonData]) => {
        const demoList = normalizeDemos(demoJsonData);
        setProjects(projectsData || []);
        setOriginalProjects(JSON.parse(JSON.stringify(projectsData || [])));
        setDemos(demoList);
        setOriginalDemos(JSON.parse(JSON.stringify(demoList)));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch editor configurations:', err);
        setToast({ message: 'Failed to load projects or demo configuration.', type: 'error' });
        setLoading(false);
      });
  }, [navigate]);

  // Autohide toast notification after 4 seconds
  useEffect(() => {
    if (toast.message) {
      const id = setTimeout(() => setToast({ message: '', type: '' }), 4000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [toast]);

  useEffect(() => {
    if (!showPreview) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setShowPreview(false);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [showPreview]);

  const activeProject = projects[activeIndex];
  const activeDemo = demos[activeDemoIndex];

  const handleFieldChange = (field, value) => {
    const updated = [...projects];
    updated[activeIndex] = {
      ...updated[activeIndex],
      [field]: value,
    };
    setProjects(updated);
  };

  const handleAvatarFieldChange = (field, value) => {
    const updated = [...projects];
    updated[activeIndex] = {
      ...updated[activeIndex],
      avatar: {
        ...updated[activeIndex].avatar,
        [field]: value,
      },
    };
    setProjects(updated);
  };

  const handleDetailViewChange = (value) => {
    const updated = [...projects];
    const project = { ...updated[activeIndex] };

    DETAIL_VIEW_FLAGS.forEach((flag) => {
      delete project[flag];
    });
    if (value) {
      project[value] = true;
    }

    updated[activeIndex] = project;
    setProjects(updated);
  };

  const handleDemoFieldChange = (field, value) => {
    setDemos((prev) =>
      prev.map((demo, idx) => (idx === activeDemoIndex ? { ...demo, [field]: value } : demo))
    );
  };

  const handleDemoHighlightChange = (index, field, value) => {
    setDemos((prev) =>
      prev.map((demo, idx) => {
        if (idx !== activeDemoIndex) return demo;
        const highlights = [...(demo.highlights || [])];
        highlights[index] = { ...highlights[index], [field]: value };
        return { ...demo, highlights };
      })
    );
  };

  const handleDemoAvatarChange = (field, value) => {
    setDemos((prev) =>
      prev.map((demo, idx) =>
        idx === activeDemoIndex ? { ...demo, avatar: { ...demo.avatar, [field]: value } } : demo
      )
    );
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024 * 1024) {
      setToast({ message: 'File is too large. Max size is 100MB.', type: 'error' });
      return;
    }

    setToast({ message: 'Uploading video...', type: 'success' });
    const formData = new FormData();
    formData.append('video', file);

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/upload-video', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setDemos((prev) =>
          prev.map((demo, idx) => (idx === activeDemoIndex ? { ...demo, videoSrc: data.videoUrl } : demo))
        );
        setToast({ message: 'Video uploaded successfully! Click Save Changes to save.', type: 'success' });
      } else {
        setToast({ message: data.message || 'Failed to upload video.', type: 'error' });
      }
    } catch (err) {
      console.error('Video upload failed:', err);
      setToast({ message: 'Network error uploading video.', type: 'error' });
    }
  };

  const handleAddProject = () => {
    const newProj = {
      number: '',
      title: 'New Assistive Technology Project',
      desc: 'Insert short project description here.',
      tag: 'Healthcare & VR',
      color: '#0d9488',
      iconName: 'SecurityShieldIcon',
      avatar: {
        projectName: 'NewProject',
        projectTitle: 'New Project Overview',
        variant: 'teal',
        customPrompt: 'Explain this new project in detail...',
      },
    };
    setProjects(renumberProjects([...projects, newProj]));
    setActiveIndex(projects.length);
    setToast({ message: 'New project created.', type: 'success' });
  };

  const handleDeleteProject = () => {
    if (projects.length <= 1) {
      setToast({ message: 'Cannot delete the only project.', type: 'error' });
      return;
    }
    const title = projects[activeIndex]?.title || 'this project';
    if (!window.confirm(`Delete "${title}"?\n\nThe remaining projects will be renumbered. Press Save Changes to make it permanent.`)) {
      return;
    }
    const filtered = projects.filter((_, idx) => idx !== activeIndex);
    setProjects(renumberProjects(filtered));
    setActiveIndex(0);
    setToast({ message: 'Project deleted.', type: 'success' });
  };

  const moveUp = (index, e) => {
    e.stopPropagation();
    if (index === 0) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setProjects(renumberProjects(updated));
    if (activeIndex === index) {
      setActiveIndex(index - 1);
    } else if (activeIndex === index - 1) {
      setActiveIndex(index);
    }
  };

  const moveDown = (index, e) => {
    e.stopPropagation();
    if (index === projects.length - 1) return;
    const updated = [...projects];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setProjects(renumberProjects(updated));
    if (activeIndex === index) {
      setActiveIndex(index + 1);
    } else if (activeIndex === index + 1) {
      setActiveIndex(index);
    }
  };

  const handleAddDemo = () => {
    setDemos((prev) => [...prev, createNewDemo()]);
    setActiveDemoIndex(demos.length);
    setToast({ message: 'New featured demo created.', type: 'success' });
  };

  const handleDeleteDemo = () => {
    if (demos.length <= 1) {
      setToast({ message: 'Cannot delete the only featured demo.', type: 'error' });
      return;
    }
    const title = demos[activeDemoIndex]?.title || 'this demo';
    if (!window.confirm(`Delete "${title}"?\n\nPress Save Changes to make it permanent.`)) {
      return;
    }
    setDemos((prev) => prev.filter((_, idx) => idx !== activeDemoIndex));
    setActiveDemoIndex(0);
    setToast({ message: 'Featured demo deleted.', type: 'success' });
  };

  const moveDemoUp = (index, e) => {
    e.stopPropagation();
    if (index === 0) return;
    const updated = [...demos];
    const temp = updated[index];
    updated[index] = updated[index - 1];
    updated[index - 1] = temp;
    setDemos(updated);
    if (activeDemoIndex === index) {
      setActiveDemoIndex(index - 1);
    } else if (activeDemoIndex === index - 1) {
      setActiveDemoIndex(index);
    }
  };

  const moveDemoDown = (index, e) => {
    e.stopPropagation();
    if (index === demos.length - 1) return;
    const updated = [...demos];
    const temp = updated[index];
    updated[index] = updated[index + 1];
    updated[index + 1] = temp;
    setDemos(updated);
    if (activeDemoIndex === index) {
      setActiveDemoIndex(index + 1);
    } else if (activeDemoIndex === index + 1) {
      setActiveDemoIndex(index);
    }
  };

  const handleSaveToServer = async () => {
    setIsSaving(true);
    setToast({ message: '', type: '' });

    try {
      const token = localStorage.getItem('admin_token');
      const isPortfolio = activeTab === 'portfolio';
      const endpoint = isPortfolio ? '/api/projects' : '/api/demo';
      const body = isPortfolio ? { projects } : { demoData: demos };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (isPortfolio) {
          setOriginalProjects(JSON.parse(JSON.stringify(projects)));
        } else {
          setOriginalDemos(JSON.parse(JSON.stringify(demos)));
        }
        setToast({ message: isPortfolio ? 'Projects configurations saved successfully!' : 'Featured Demo configuration saved successfully!', type: 'success' });
      } else {
        setToast({ message: data.message || 'Failed to save to server.', type: 'error' });
      }
    } catch (err) {
      console.error('Save to server failed:', err);
      setToast({
        message: 'Could not write to local server disk. Please export JSON file and replace it manually.',
        type: 'error',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDownloadBackup = () => {
    const isPortfolio = activeTab === 'portfolio';
    const filename = isPortfolio ? 'projects.json' : 'demo.json';
    const payload = isPortfolio ? projects : demos;
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    setToast({ message: `Downloaded ${filename} configuration backup!`, type: 'success' });
  };

  const handleCancelChanges = () => {
    if (window.confirm('Are you sure you want to discard all unsaved changes for this tab?')) {
      if (activeTab === 'portfolio') {
        setProjects(JSON.parse(JSON.stringify(originalProjects)));
        setActiveIndex(0);
      } else {
        setDemos(JSON.parse(JSON.stringify(originalDemos)));
        setActiveDemoIndex(0);
      }
      setToast({ message: 'Draft changes discarded.', type: 'success' });
    }
  };

  // Lightweight line diff helper
  const computeLineDiff = (oldText, newText) => {
    const oldLines = (oldText || '').split('\n');
    const newLines = (newText || '').split('\n');
    const diffs = [];
    
    let i = 0, j = 0;
    while (i < oldLines.length || j < newLines.length) {
      if (i < oldLines.length && j < newLines.length) {
        if (oldLines[i] === newLines[j]) {
          diffs.push({ type: 'unchanged', text: oldLines[i] });
          i++;
          j++;
        } else {
          let foundMatch = false;
          for (let look = 1; look <= 5; look++) {
            if (i + look < oldLines.length && oldLines[i + look] === newLines[j]) {
              for (let d = 0; d < look; d++) {
                diffs.push({ type: 'deleted', text: oldLines[i + d] });
              }
              i += look;
              foundMatch = true;
              break;
            }
            if (j + look < newLines.length && oldLines[i] === newLines[j + look]) {
              for (let a = 0; a < look; a++) {
                diffs.push({ type: 'added', text: newLines[j + a] });
              }
              j += look;
              foundMatch = true;
              break;
            }
          }
          if (!foundMatch) {
            diffs.push({ type: 'deleted', text: oldLines[i] });
            diffs.push({ type: 'added', text: newLines[j] });
            i++;
            j++;
          }
        }
      } else if (i < oldLines.length) {
        diffs.push({ type: 'deleted', text: oldLines[i] });
        i++;
      } else if (j < newLines.length) {
        diffs.push({ type: 'added', text: newLines[j] });
        j++;
      }
    }
    return diffs;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/OurProjects/ProjectDetail');
  };

  const renderProjectMediaPreview = () => {
    let images = [];
    if (activeProject.isArast) {
      images = [
        { src: '/arast_fire_simulation.png', caption: 'Incident Simulation' },
        { src: '/arast_dashboard.png', caption: 'Analytics Dashboard' }
      ];
    } else if (activeProject.isAra) {
      images = [
        { src: '/ara_tablet.png', caption: 'Hazard Scanning Interface' },
        { src: '/ara_dashboard.png', caption: 'Risk Evaluation Analytics' }
      ];
    } else if (activeProject.isMri) {
      images = [
        { src: '/mri_team.png', caption: 'Patient VR Acclimatisation' },
        { src: '/mri_architecture.png', caption: 'Suitability Assessment' }
      ];
    } else if (activeProject.isOral) {
      images = [
        { src: '/oral_exam_overview.png', caption: 'AI Practice Interface' }
      ];
    } else if (activeProject.isPolite) {
      images = [
        { src: '/polite_vr_mockup.png', caption: 'Immersive Safety Package' }
      ];
    } else if (activeProject.isRoleplay) {
      images = [
        { src: '/roleplay_avatar.png', caption: 'Customisable Avatars' },
        { src: '/roleplay_mockup.png', caption: 'Intents Authoring' }
      ];
    } else if (activeProject.isSafetyVR) {
      images = [
        { src: '/patient_safety_sim.png', caption: 'Emergency Room Simulation' }
      ];
    }

    if (images.length === 0) return null;

    return (
      <div className="glass-card" style={{ padding: '1rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.75)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: activeProject.color || 'var(--accent-teal)' }} />
          <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>Project Media Preview</strong>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: images.length > 1 ? '1fr 1fr' : '1fr', gap: '0.65rem' }}>
          {images.map((img, idx) => (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)', aspectRatio: '16/10', background: 'rgba(0,0,0,0.05)' }}>
                <img src={img.src} alt={img.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 650 }}>{img.caption}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderPortfolioPreview = () => {
    if (!activeProject) return null;
    const ItemIcon = getIconComponent(activeProject.iconName);
    const detailOption = getProjectDetailOption(activeProject);
    const detailText = detailOption.value ? detailOption.description : '';

    return (
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: 'rgba(255, 255, 255, 0.4)' }}>
        <span className="pill-tag pill-tag--teal" style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>VISUAL PREVIEW</span>
        
        {/* Project Card Mockup */}
        <div className="glass-card project-item-card" style={{ position: 'relative', padding: '1.25rem', border: '1px solid var(--border)', cursor: 'default' }}>
          <div className="project-item-stripe" style={{ backgroundColor: activeProject.color, position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px' }} />
          <div className="project-item-header" style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div className="project-item-leading" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div 
                className="project-item-icon-wrapper"
                style={{
                  background: `${activeProject.color}08`,
                  borderColor: `${activeProject.color}1a`,
                  color: activeProject.color,
                  padding: '0.55rem',
                  borderRadius: '12px',
                  border: '1px solid',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <ItemIcon style={{ width: '20px', height: '20px' }} />
              </div>
              <span className="project-item-number" style={{ color: `${activeProject.color}20`, fontWeight: 800, fontSize: '1.1rem' }}>
                {activeProject.number}
              </span>
            </div>
            <div className="project-item-info" style={{ flex: 1, minWidth: 0 }}>
              <div className="project-item-tag-row" style={{ marginBottom: '0.35rem' }}>
                <span
                  className="project-tag"
                  style={{
                    background: `${activeProject.color}0a`,
                    color: activeProject.color,
                    borderColor: `${activeProject.color}20`,
                    padding: '0.15rem 0.5rem',
                    borderRadius: '999px',
                    border: '1px solid',
                    fontSize: '0.72rem',
                    fontWeight: 650,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem'
                  }}
                >
                  <span style={{ display: 'inline-block', width: '5px', height: '5px', borderRadius: '50%', backgroundColor: activeProject.color }} />
                  {activeProject.tag}
                </span>
              </div>
              {/* Wraps title to multiple lines so that the entire title is fully visible */}
              <h3 className="project-item-title" style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 0.4rem 0', color: 'var(--text-heading)', lineBreak: 'anywhere', wordBreak: 'break-word', lineHeight: '1.3' }}>
                {activeProject.title}
              </h3>
              <p className="project-item-desc" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                {activeProject.desc}
              </p>
            </div>
          </div>
        </div>

        {/* Custom Detail Page Enabled Indicator */}
        {detailText && (
          <div className="glass-card" style={{ padding: '0.85rem 1.1rem', border: '1px solid rgba(13, 148, 136, 0.2)', background: 'rgba(13, 148, 136, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span style={{ fontSize: '1.15rem' }}>✨</span>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', lineHeight: '1.45' }}>
              <strong style={{ color: 'var(--accent-teal)' }}>Expanded Detail View Enabled:</strong> {detailText} will be displayed on the portfolio page.
            </div>
          </div>
        )}

        {/* Project Media Mockup Images */}
        {renderProjectMediaPreview()}

        {/* AI Avatar voice bubble simulation preview */}
        {activeProject.avatar && (
          <div className="glass-card" style={{ padding: '1.1rem', border: '1px solid var(--border)', background: 'rgba(255,255,255,0.75)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-teal)' }} />
                <strong style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>AI Avatar Settings Preview</strong>
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: 650, color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.06)', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                Theme: {activeProject.avatar.variant || 'teal'}
              </span>
            </div>

            {activeProject.avatar.projectTitle && (
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-heading)', margin: '0.1rem 0' }}>
                {activeProject.avatar.projectTitle}
              </div>
            )}

            {activeProject.avatar.customPrompt && (
              <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontStyle: 'italic', background: 'rgba(0,0,0,0.02)', padding: '0.65rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid var(--accent-teal)', lineHeight: '1.45' }}>
                "{activeProject.avatar.customPrompt}"
              </div>
            )}

            {/* Interactive Button Preview Mock */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '0.15rem' }}>
              <button
                type="button"
                className={`avatar-explain-btn${activeProject.avatar.variant === 'violet' ? ' avatar-explain-btn--violet' : ''}`}
                style={{ fontSize: '0.72rem', padding: '0.45rem 0.9rem', cursor: 'default' }}
                onClick={(e) => e.preventDefault()}
              >
                <span style={{ marginRight: '4px' }}>✨</span>
                Listen to Avatar Explain ({activeProject.avatar.projectName || 'ARAST'})
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderDemoPreview = () => {
    if (!activeDemo) return null;
    return (
      <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', background: 'rgba(255, 255, 255, 0.4)' }}>
        <span className="pill-tag pill-tag--teal" style={{ alignSelf: 'flex-start', fontSize: '0.65rem' }}>VISUAL PREVIEW</span>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 0.25rem 0', color: 'var(--text-heading)' }}>{activeDemo.title || 'Featured Demo'}</h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>{activeDemo.subtitle || ''}</p>
        </div>

        <div style={{ background: 'rgba(0,0,0,0.1)', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          {activeDemo.videoSrc ? (
            <video
              src={activeDemo.videoSrc}
              controls
              muted
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              key={activeDemo.videoSrc}
            />
          ) : (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>No video selected</span>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem' }}>
          {(activeDemo.highlights || []).map((h, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.4)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 750, color: 'var(--text-heading)' }}>{h.value || '-'}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{h.label || '-'}</div>
            </div>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 700, margin: '0 0 0.35rem 0', color: 'var(--text-heading)' }}>{activeDemo.howItWorksTitle || 'How it works'}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4', margin: 0 }}>{activeDemo.description || ''}</p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {(activeDemo.tags || []).filter(Boolean).map((t, idx) => (
            <span key={idx} className="pill-tag pill-tag--teal" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>{t}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderPortfolioDiff = () => {
    const oldJSON = JSON.stringify(originalProjects, null, 2);
    const newJSON = JSON.stringify(projects, null, 2);
    const diffs = computeLineDiff(oldJSON, newJSON);
    
    const hasChanges = diffs.some(d => d.type !== 'unchanged');
    if (!hasChanges) {
      return (
        <div className="glass-card editor-empty-state" style={{ padding: '3rem 1.5rem', background: '#0f172a', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}>
          <svg className="editor-empty-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 1rem' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h4 style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.4rem 0' }}>No Unsaved Changes</h4>
          <p style={{ fontSize: '0.75rem', margin: 0, lineHeight: '1.4' }}>Modify any project input values on the left to see the configuration changes in real-time.</p>
        </div>
      );
    }

    return (
      <div className="editor-diff-box">
        {diffs.map((line, idx) => {
          let lineClass = '';
          let prefix = ' ';
          if (line.type === 'added') {
            lineClass = 'diff-line--added';
            prefix = '+';
          } else if (line.type === 'deleted') {
            lineClass = 'diff-line--deleted';
            prefix = '-';
          }
          return (
            <div key={idx} className={`diff-line ${lineClass}`}>
              <span className="diff-line-num">{idx + 1}</span>
              <span>{prefix} {line.text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderDemoDiff = () => {
    const oldJSON = JSON.stringify(originalDemos, null, 2);
    const newJSON = JSON.stringify(demos, null, 2);
    const diffs = computeLineDiff(oldJSON, newJSON);
    
    const hasChanges = diffs.some(d => d.type !== 'unchanged');
    if (!hasChanges) {
      return (
        <div className="glass-card editor-empty-state" style={{ padding: '3rem 1.5rem', background: '#0f172a', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px' }}>
          <svg className="editor-empty-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ color: 'rgba(255,255,255,0.2)', margin: '0 auto 1rem' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h4 style={{ fontSize: '0.9rem', color: '#e2e8f0', margin: '0 0 0.4rem 0' }}>No Unsaved Changes</h4>
          <p style={{ fontSize: '0.75rem', margin: 0, lineHeight: '1.4' }}>Modify any demo input fields on the left to see the configuration changes in real-time.</p>
        </div>
      );
    }

    return (
      <div className="editor-diff-box">
        {diffs.map((line, idx) => {
          let lineClass = '';
          let prefix = ' ';
          if (line.type === 'added') {
            lineClass = 'diff-line--added';
            prefix = '+';
          } else if (line.type === 'deleted') {
            lineClass = 'diff-line--deleted';
            prefix = '-';
          }
          return (
            <div key={idx} className={`diff-line ${lineClass}`}>
              <span className="diff-line-num">{idx + 1}</span>
              <span>{prefix} {line.text}</span>
            </div>
          );
        })}
      </div>
    );
  };

  const renderPreviewPanel = () => {
    const isPortfolio = activeTab === 'portfolio';
    const previewTitle = isPortfolio
      ? activeProject?.title || 'Portfolio Preview'
      : activeDemo?.title || 'Featured Demo Preview';

    return createPortal(
      <div
        className="editor-preview-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-preview-title"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) {
            setShowPreview(false);
          }
        }}
      >
        <div className="editor-preview-modal-card">
          <div className="editor-preview-modal-header">
            <div className="editor-preview-modal-title-group">
              <span className="section-label">Preview</span>
              <h2 id="editor-preview-title">{previewTitle}</h2>
            </div>
            <button
              type="button"
              className="editor-preview-close"
              onClick={() => setShowPreview(false)}
              aria-label="Close preview"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="editor-preview-tabs">
            <button
              type="button"
              className={`editor-preview-tab-btn ${previewTab === 'visual' ? 'editor-preview-tab-btn--active' : ''}`}
              onClick={() => setPreviewTab('visual')}
            >
              Visual Preview
            </button>
            <button
              type="button"
              className={`editor-preview-tab-btn ${previewTab === 'diff' ? 'editor-preview-tab-btn--active' : ''}`}
              onClick={() => setPreviewTab('diff')}
            >
              Changes Diff (JSON)
            </button>
          </div>

          <div className="editor-preview-panel">
            {previewTab === 'visual' ? (
              isPortfolio ? renderPortfolioPreview() : renderDemoPreview()
            ) : (
              isPortfolio ? renderPortfolioDiff() : renderDemoDiff()
            )}
          </div>
        </div>
      </div>,
      document.body
    );
  };

  if (loading) {
    return (
      <div className="route-fallback" role="status" aria-live="polite" style={{ height: '80vh', display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center' }}>
        <span className="route-fallback-spinner" />
        <span>Loading Editor Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="page-container page-container--wide animate-fade-in">
      {toast.message && (
        <div className={`editor-toast editor-toast--${toast.type}`} role="status">
          {toast.type === 'success' ? (
            <svg className="editor-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          ) : (
            <svg className="editor-toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {showPreview && renderPreviewPanel()}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <BackButton onClick={() => navigate('/OurProjects/ProjectDetail')} label="Return to Portfolio" />
        <div className="editor-header-actions">
          <button className="editor-btn editor-btn--secondary" onClick={() => setShowPreview(true)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
            Open Preview
          </button>
          <button className="editor-btn editor-btn--secondary" onClick={handleDownloadBackup}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"></path>
            </svg>
            Export {activeTab === 'portfolio' ? 'projects.json' : 'demo.json'}
          </button>
          <button className="editor-btn editor-btn--primary" onClick={handleSaveToServer} disabled={isSaving}>
            {isSaving ? (
              <span className="route-fallback-spinner" style={{ width: '14px', height: '14px' }} />
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                <polyline points="17 21 17 13 7 13 7 21"></polyline>
                <polyline points="7 3 7 8 15 8"></polyline>
              </svg>
            )}
            Save Changes
          </button>
          <button className="editor-btn editor-btn--secondary" onClick={handleLogout} style={{ border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444' }}>
            Logout Admin
          </button>
        </div>
      </div>

      <div className="page-header" style={{ marginTop: '1.2rem' }}>
        <span className="section-label">Management System</span>
        <h1 className="page-title">Project Portfolio Editor</h1>
        <p className="page-subtitle">Configure, re-order, edit content, and define Custom AI prompts for your showcase projects.</p>
      </div>

      {/* Tab Switcher */}
      <div className="editor-tabs">
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'portfolio' ? 'editor-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('portfolio')}
        >
          Portfolio Projects
        </button>
        <button
          type="button"
          className={`editor-tab-btn ${activeTab === 'demo' ? 'editor-tab-btn--active' : ''}`}
          onClick={() => setActiveTab('demo')}
        >
          Featured Demo Project
        </button>
      </div>

      <div className="editor-container">
        {activeTab === 'portfolio' ? (
          <>
            {/* Left selector sidebar */}
            <div className="editor-list-panel">
              <div className="editor-list-title-row">
                <h2 className="editor-list-title">All Projects</h2>
                <span style={{ fontSize: '0.75rem', fontWeight: 650, color: 'var(--text-secondary)' }}>
                  {projects.length} Total
                </span>
              </div>

              <div className="editor-list-cards">
                {projects.map((proj, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <div
                      key={idx}
                      className={`editor-item-card ${isActive ? 'editor-item-card--active' : ''}`}
                      onClick={() => setActiveIndex(idx)}
                    >
                      <div className="editor-item-stripe" style={{ backgroundColor: proj.color }} />
                      <div className="editor-item-info">
                        <span className="editor-item-number">Project {proj.number}</span>
                        <h3 className="editor-item-title">{proj.title}</h3>
                      </div>

                      <div className="editor-item-actions">
                        <button
                          type="button"
                          className="editor-item-action-btn"
                          onClick={(e) => moveUp(idx, e)}
                          disabled={idx === 0}
                          title="Move Up"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="editor-item-action-btn"
                          onClick={(e) => moveDown(idx, e)}
                          disabled={idx === projects.length - 1}
                          title="Move Down"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button type="button" className="editor-add-btn" onClick={handleAddProject}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Project
              </button>
            </div>

            {/* Right editor details form */}
            <div className="editor-detail-column">
              <div className="glass-card editor-form-panel">
                {activeProject ? (
                  <div className="editor-form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                      <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Editing Project {activeProject.number}:</span> 
                        {activeProject.title ? (activeProject.title.length > 30 ? activeProject.title.substring(0, 30) + '...' : activeProject.title) : 'Untitled'}
                      </h2>
                      <button type="button" className="editor-btn editor-btn--danger" onClick={handleDeleteProject} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                        Delete Project
                      </button>
                    </div>

                    <div className="editor-grid-fields">
                      <div className="editor-field">
                        <label className="editor-label">Display Number (Auto)</label>
                        <input
                          type="text"
                          className="editor-input editor-input--readonly"
                          value={activeProject.number || ''}
                          readOnly
                          title="Set automatically from the list order"
                        />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.3rem', display: 'block' }}>
                          Updates automatically when you re-order, add, or delete projects.
                        </span>
                      </div>

                      <div className="editor-field">
                        <label className="editor-label">Tag Category Label</label>
                        <input
                          type="text"
                          className="editor-input"
                          value={activeProject.tag || ''}
                          onChange={(e) => handleFieldChange('tag', e.target.value)}
                          placeholder="e.g. Healthcare & VR"
                        />
                      </div>

                      <div className="editor-field editor-field--span-all">
                        <label className="editor-label">Project Title</label>
                        <input
                          type="text"
                          className="editor-input"
                          value={activeProject.title || ''}
                          onChange={(e) => handleFieldChange('title', e.target.value)}
                          placeholder="Enter project headline"
                        />
                      </div>

                      <div className="editor-field editor-field--span-all">
                        <label className="editor-label">Short Description</label>
                        <textarea
                          className="editor-textarea"
                          value={activeProject.desc || ''}
                          onChange={(e) => handleFieldChange('desc', e.target.value)}
                          placeholder="Describe this project in 1-2 sentences."
                        />
                      </div>

                      <div className="editor-field">
                        <label className="editor-label">Visual Icon SVG Mapping</label>
                        <select
                          className="editor-select"
                          value={activeProject.iconName || 'SecurityShieldIcon'}
                          onChange={(e) => handleFieldChange('iconName', e.target.value)}
                        >
                          <option value="SecurityShieldIcon">Shield / Security (SecurityShieldIcon)</option>
                          <option value="AiScannerIcon">AI Scanner / Circle (AiScannerIcon)</option>
                          <option value="MriHeartbeatIcon">Heartbeat / Healthcare (MriHeartbeatIcon)</option>
                          <option value="EducationIcon">Graduation Cap / Education (EducationIcon)</option>
                          <option value="VrHeadsetIcon">VR Headset / Technology (VrHeadsetIcon)</option>
                          <option value="RoleplayIcon">Users / Roleplay (RoleplayIcon)</option>
                          <option value="SafetyVrIcon">Cross Shield / Safety (SafetyVrIcon)</option>
                        </select>
                      </div>

                      <div className="editor-field">
                        <label className="editor-label">Theme Color Accent</label>
                        <div className="editor-color-input-row">
                          <input
                            type="color"
                            className="editor-color-picker"
                            value={activeProject.color || '#0d9488'}
                            onChange={(e) => handleFieldChange('color', e.target.value)}
                          />
                          <div className="editor-preset-colors">
                            {PRESET_COLORS.map((col) => (
                              <button
                                key={col}
                                type="button"
                                className={`editor-preset-color-dot ${activeProject.color === col ? 'editor-preset-color-dot--active' : ''}`}
                                style={{ backgroundColor: col }}
                                onClick={() => handleFieldChange('color', col)}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="editor-field editor-field--span-all">
                        <label className="editor-label">Expanded Detail Page Template</label>
                        <select
                          className="editor-select"
                          value={getProjectDetailOption(activeProject).value}
                          onChange={(e) => handleDetailViewChange(e.target.value)}
                        >
                          {DETAIL_VIEW_OPTIONS.map((option) => (
                            <option key={option.value || 'none'} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className="editor-helper-text">
                          Controls which custom media/details pop-up opens when this portfolio card is selected.
                        </span>
                      </div>
                    </div>

                    {/* Avatar Narration settings */}
                    <h3 className="editor-section-title" style={{ marginTop: '1rem' }}>AI Avatar Narration Settings</h3>
                    
                    <div className="editor-grid-fields">
                      <div className="editor-field">
                        <label className="editor-label">Avatar Project Tag</label>
                        <input
                          type="text"
                          className="editor-input"
                          value={activeProject.avatar?.projectName || ''}
                          onChange={(e) => handleAvatarFieldChange('projectName', e.target.value)}
                          placeholder="e.g. ARAST"
                        />
                      </div>

                      <div className="editor-field">
                        <label className="editor-label">Avatar Project Display Title</label>
                        <input
                          type="text"
                          className="editor-input"
                          value={activeProject.avatar?.projectTitle || ''}
                          onChange={(e) => handleAvatarFieldChange('projectTitle', e.target.value)}
                          placeholder="e.g. Augmented Reality Application for Security Training (ARAST)"
                        />
                      </div>

                      <div className="editor-field">
                        <label className="editor-label">Avatar Highlight Theme</label>
                        <select
                          className="editor-select"
                          value={activeProject.avatar?.variant || 'teal'}
                          onChange={(e) => handleAvatarFieldChange('variant', e.target.value)}
                        >
                          <option value="teal">Teal Highlight Theme</option>
                          <option value="violet">Violet Highlight Theme</option>
                        </select>
                      </div>

                      <div className="editor-field editor-field--span-all">
                        <label className="editor-label">Avatar Narration Speech Prompt (GPT)</label>
                        <textarea
                          className="editor-textarea editor-avatar-prompt"
                          value={activeProject.avatar?.customPrompt || ''}
                          onChange={(e) => handleAvatarFieldChange('customPrompt', e.target.value)}
                          placeholder="Write detailed narration script here. This script is sent to the LLM to guide speech."
                        />
                      </div>
                    </div>

                    <div className="editor-form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                      <button type="button" className="editor-btn editor-btn--primary" onClick={handleSaveToServer} disabled={isSaving}>
                        {isSaving ? (
                          <span className="route-fallback-spinner" style={{ width: '14px', height: '14px' }} />
                        ) : (
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                          </svg>
                        )}
                        Save Changes
                      </button>
                      <button type="button" className="editor-btn editor-btn--secondary" onClick={handleCancelChanges} style={{ border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444' }}>
                        Discard Draft Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="editor-empty-state">
                    <svg className="editor-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="9" y1="9" x2="15" y2="9"></line>
                      <line x1="9" y1="13" x2="15" y2="13"></line>
                      <line x1="9" y1="17" x2="13" y2="17"></line>
                    </svg>
                    <h3>No Project Selected</h3>
                    <p>Please select a project from the sidebar list or add a new one to begin editing.</p>
                  </div>
                )}
              </div>

            </div>
          </>
        ) : (
          <>
            {/* Left selector sidebar (Featured Demos) */}
            <div className="editor-list-panel">
              <div className="editor-list-title-row">
                <h2 className="editor-list-title">All Demos</h2>
                <span style={{ fontSize: '0.75rem', fontWeight: 650, color: 'var(--text-secondary)' }}>
                  {demos.length} Total
                </span>
              </div>

              <div className="editor-list-cards">
                {demos.map((demo, idx) => {
                  const isActive = idx === activeDemoIndex;
                  return (
                    <div
                      key={idx}
                      className={`editor-item-card ${isActive ? 'editor-item-card--active' : ''}`}
                      onClick={() => setActiveDemoIndex(idx)}
                    >
                      <div className="editor-item-stripe" style={{ backgroundColor: '#7c3aed' }} />
                      <div className="editor-item-info">
                        <span className="editor-item-number">Demo {idx + 1}</span>
                        <h3 className="editor-item-title">{demo.title || 'Untitled Demo'}</h3>
                      </div>

                      <div className="editor-item-actions">
                        <button
                          type="button"
                          className="editor-item-action-btn"
                          onClick={(e) => moveDemoUp(idx, e)}
                          disabled={idx === 0}
                          title="Move Up"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="18 15 12 9 6 15"></polyline>
                          </svg>
                        </button>
                        <button
                          type="button"
                          className="editor-item-action-btn"
                          onClick={(e) => moveDemoDown(idx, e)}
                          disabled={idx === demos.length - 1}
                          title="Move Down"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="6 9 12 15 18 9"></polyline>
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button type="button" className="editor-add-btn" onClick={handleAddDemo}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                Add New Demo
              </button>
            </div>

            {/* Right demo editor form */}
            <div className="editor-detail-column">
              <div className="glass-card editor-form-panel">
                {activeDemo ? (
                  <div className="editor-form-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '0.5rem' }}>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Editing Demo {activeDemoIndex + 1}:</span>{' '}
                      {activeDemo.title ? (activeDemo.title.length > 30 ? activeDemo.title.substring(0, 30) + '...' : activeDemo.title) : 'Untitled'}
                    </h2>
                    <button type="button" className="editor-btn editor-btn--danger" onClick={handleDeleteDemo} style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                      </svg>
                      Delete Demo
                    </button>
                  </div>

                  <div className="editor-grid-fields">
                    <div className="editor-field">
                      <label className="editor-label">Demo Page Title</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={activeDemo.title || ''}
                        onChange={(e) => handleDemoFieldChange('title', e.target.value)}
                        placeholder="e.g. Featured Demo"
                      />
                    </div>

                    <div className="editor-field">
                      <label className="editor-label">Demo Page Subtitle</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={activeDemo.subtitle || ''}
                        onChange={(e) => handleDemoFieldChange('subtitle', e.target.value)}
                        placeholder="Enter subtitle description"
                      />
                    </div>

                    <div className="editor-field">
                      <label className="editor-label">Demo Video File Path / URL</label>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="editor-input"
                          value={activeDemo.videoSrc || ''}
                          onChange={(e) => handleDemoFieldChange('videoSrc', e.target.value)}
                          placeholder="e.g. /demo-video.mp4"
                          style={{ flex: 1 }}
                        />
                        <label className="editor-btn editor-btn--secondary" style={{ cursor: 'pointer', margin: 0, padding: '0.65rem 1rem', display: 'inline-flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path>
                          </svg>
                          Upload MP4
                          <input
                            type="file"
                            accept="video/mp4,video/*"
                            style={{ display: 'none' }}
                            onChange={handleVideoUpload}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="editor-field">
                      <label className="editor-label">"How it works" Section Title</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={activeDemo.howItWorksTitle || ''}
                        onChange={(e) => handleDemoFieldChange('howItWorksTitle', e.target.value)}
                        placeholder="e.g. How it works"
                      />
                    </div>

                    <div className="editor-field editor-field--span-all">
                      <label className="editor-label">Demo Project Description</label>
                      <textarea
                        className="editor-textarea"
                        value={activeDemo.description || ''}
                        onChange={(e) => handleDemoFieldChange('description', e.target.value)}
                        placeholder="Describe the demo project mechanics..."
                      />
                    </div>

                    <div className="editor-field editor-field--span-all">
                      <label className="editor-label">Tags (comma-separated)</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={activeDemo.tags ? activeDemo.tags.join(', ') : ''}
                        onChange={(e) => {
                          const newTags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
                          handleDemoFieldChange('tags', newTags);
                        }}
                        placeholder="e.g. Virtual Reality, Emergency Protocol, Patient Safety"
                      />
                    </div>
                  </div>

                  <h3 className="editor-section-title" style={{ marginTop: '1.2rem' }}>Featured Demo Highlights</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem' }}>
                    {[0, 1, 2, 3].map((idx) => {
                      const highlight = activeDemo.highlights?.[idx] || { value: '', label: '' };
                      return (
                        <div key={idx} className="glass-card" style={{ padding: '1rem', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.65rem', background: 'rgba(0, 0, 0, 0.01)' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-teal)' }}>Highlight {idx + 1}</span>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            <div>
                              <label className="editor-label" style={{ fontSize: '0.72rem' }}>Value / Key</label>
                              <input
                                type="text"
                                className="editor-input"
                                value={highlight.value || ''}
                                onChange={(e) => handleDemoHighlightChange(idx, 'value', e.target.value)}
                                placeholder="e.g. VR Simulation"
                              />
                            </div>
                            <div>
                              <label className="editor-label" style={{ fontSize: '0.72rem' }}>Label / Description</label>
                              <input
                                type="text"
                                className="editor-input"
                                value={highlight.label || ''}
                                onChange={(e) => handleDemoHighlightChange(idx, 'label', e.target.value)}
                                placeholder="e.g. Emergency Scenario"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <h3 className="editor-section-title" style={{ marginTop: '1.5rem' }}>AI Avatar Narration Settings (Featured Demo)</h3>
                  <div className="editor-grid-fields">
                    <div className="editor-field">
                      <label className="editor-label">Avatar Project Tag</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={activeDemo.avatar?.projectName || ''}
                        onChange={(e) => handleDemoAvatarChange('projectName', e.target.value)}
                        placeholder="e.g. PatientSafetyVR"
                      />
                    </div>

                    <div className="editor-field">
                      <label className="editor-label">Avatar Project Display Title</label>
                      <input
                        type="text"
                        className="editor-input"
                        value={activeDemo.avatar?.projectTitle || ''}
                        onChange={(e) => handleDemoAvatarChange('projectTitle', e.target.value)}
                        placeholder="e.g. Patient Safety VR Training (Featured Demo)"
                      />
                    </div>

                    <div className="editor-field editor-field--span-all">
                      <label className="editor-label">Avatar Narration Speech Prompt (GPT)</label>
                      <textarea
                        className="editor-textarea editor-avatar-prompt"
                        value={activeDemo.avatar?.customPrompt || ''}
                        onChange={(e) => handleDemoAvatarChange('customPrompt', e.target.value)}
                        placeholder="Write detailed narration script here. This script is sent to the LLM to guide speech."
                      />
                    </div>
                  </div>

                  <div className="editor-form-actions" style={{ display: 'flex', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                    <button type="button" className="editor-btn editor-btn--primary" onClick={handleSaveToServer} disabled={isSaving}>
                      {isSaving ? (
                        <span className="route-fallback-spinner" style={{ width: '14px', height: '14px' }} />
                      ) : (
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                          <polyline points="17 21 17 13 7 13 7 21"></polyline>
                          <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                      )}
                      Save Changes
                    </button>
                    <button type="button" className="editor-btn editor-btn--secondary" onClick={handleCancelChanges} style={{ border: '1px solid rgba(239, 68, 68, 0.25)', color: '#ef4444' }}>
                      Discard Draft Changes
                    </button>
                  </div>
                </div>
              ) : (
                <div className="editor-empty-state">
                  <svg className="editor-empty-icon" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="9" y1="9" x2="15" y2="9"></line>
                    <line x1="9" y1="13" x2="15" y2="13"></line>
                    <line x1="9" y1="17" x2="13" y2="17"></line>
                  </svg>
                  <h3>No Demo Selected</h3>
                  <p>Please select a demo from the sidebar list or add a new one to begin editing.</p>
                </div>
              )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
