import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/ProjectEditor.css';

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
    value: 'isCustom',
    label: 'Custom Detail - Image Layout Builder',
    description: 'Admin-managed sections with uploaded images and configurable image placement.',
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

const BUILT_IN_TEMPLATE_IMAGE_SLOTS = {
  isArast: [
    { key: 'arastFireSimulation', label: 'Incident Simulation Image', defaultSrc: '/arast_fire_simulation.png' },
    { key: 'arastPackage', label: 'Suspicious Package Image', defaultSrc: '/arast_package.png' },
    { key: 'arastDashboard', label: 'Analytics Dashboard Image', defaultSrc: '/arast_dashboard.png' },
  ],
  isAra: [
    { key: 'araTablet', label: 'Risk Assessment Tablet Image', defaultSrc: '/ara_tablet.png' },
    { key: 'araDashboard', label: 'Risk Analytics Dashboard Image', defaultSrc: '/ara_dashboard.png' },
  ],
  isMri: [
    { key: 'mriTeam', label: 'VR Acclimatisation Team Image', defaultSrc: '/mri_team.png' },
    { key: 'mriArchitecture', label: 'System Architecture Diagram', defaultSrc: '/mri_architecture.png' },
    { key: 'mriPatient', label: 'Patient Simulation Setup Image', defaultSrc: '/mri_patient.png' },
    { key: 'cghLogo', label: 'CGH Partner Logo', defaultSrc: '/cgh_logo.png' },
  ],
  isOral: [
    { key: 'oralOverview', label: 'AI Practice Interface Image', defaultSrc: '/oral_exam_overview.png' },
    { key: 'oralPilot', label: 'Pilot Testing Classroom Image', defaultSrc: '/oral_exam_pilot.png' },
    { key: 'dunmanLogo', label: 'Dunman Partner Logo', defaultSrc: '/dunman_logo.png' },
    { key: 'bartleyLogo', label: 'Bartley Partner Logo', defaultSrc: '/bartley_logo.png' },
  ],
  isPolite: [
    { key: 'politeVrMockup', label: 'Immersive Safety Package Image', defaultSrc: '/polite_vr_mockup.png' },
  ],
  isRoleplay: [
    { key: 'roleplayAvatar', label: 'Virtual Role-play Avatar Image', defaultSrc: '/roleplay_avatar.png' },
    { key: 'roleplayMockup', label: 'Roleplay Dashboard Mockup Image', defaultSrc: '/roleplay_mockup.png' },
    { key: 'jmaLogo', label: 'JMA Partner Logo', defaultSrc: '/jma_logo.png' },
  ],
  isSafetyVR: [
    { key: 'patientSafetySim', label: 'Emergency Room Simulation Image', defaultSrc: '/patient_safety_sim.png' },
    { key: 'patientSafetyTrainees', label: 'Trainees Review Image', defaultSrc: '/patient_safety_trainees.png' },
  ],
};

const getProjectDetailOption = (project) =>
  DETAIL_VIEW_OPTIONS.find((option) => option.value && project?.[option.value]) || DETAIL_VIEW_OPTIONS[0];

const getTemplateImageSlots = (project) =>
  BUILT_IN_TEMPLATE_IMAGE_SLOTS[getProjectDetailOption(project).value] || [];

const PROJECT_PREVIEW_STORAGE_KEY = 'admin_project_preview_projects';
const DEMO_PREVIEW_STORAGE_KEY = 'admin_demo_preview_demos';

// demo.json historically held a single demo object; newer saves hold an array.
const normalizeDemos = (data) => {
  if (Array.isArray(data)) return data.filter((d) => d && typeof d === 'object');
  if (data && typeof data === 'object') return [data];
  return [];
};

// Display numbers always follow the list order (01, 02, ...).
const renumberProjects = (list) =>
  list.map((proj, idx) => ({ ...proj, number: String(idx + 1).padStart(2, '0') }));

const createCustomSection = () => ({
  heading: 'Project Overview',
  body: 'Describe this section for visitors...',
  imageSrc: '',
  imageAlt: '',
  imageCaption: '',
  imagePosition: 'right',
});

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
  const [previewNonce, setPreviewNonce] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ message: '', type: '' });
  const previewScrollRef = useRef(null);

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
    requestAnimationFrame(() => previewScrollRef.current?.focus());
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [showPreview]);

  const activeProject = projects[activeIndex];
  const activeDemo = demos[activeDemoIndex];
  const activeProjectTemplateImageSlots = getTemplateImageSlots(activeProject);

  const prepareVisitorPreview = () => {
    try {
      if (activeTab === 'portfolio') {
        sessionStorage.setItem(PROJECT_PREVIEW_STORAGE_KEY, JSON.stringify(projects));
      } else {
        sessionStorage.setItem(DEMO_PREVIEW_STORAGE_KEY, JSON.stringify(demos));
      }
    } catch (err) {
      console.warn('Failed to prepare admin visitor preview payload:', err);
    }
    setPreviewNonce(Date.now());
  };

  const handleOpenPreview = () => {
    prepareVisitorPreview();
    setPreviewTab('visual');
    setShowPreview(true);
  };

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

  const handleTemplateImageChange = (slotKey, value) => {
    setProjects((prev) =>
      prev.map((project, idx) => {
        if (idx !== activeIndex) return project;
        return {
          ...project,
          templateImages: {
            ...(project.templateImages || {}),
            [slotKey]: value,
          },
        };
      })
    );
  };

  const handleTemplateImageReset = (slotKey) => {
    setProjects((prev) =>
      prev.map((project, idx) => {
        if (idx !== activeIndex) return project;
        const templateImages = { ...(project.templateImages || {}) };
        delete templateImages[slotKey];
        return {
          ...project,
          templateImages,
        };
      })
    );
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
    if (value === 'isCustom' && (!Array.isArray(project.customSections) || project.customSections.length === 0)) {
      project.customSections = [createCustomSection()];
    }

    updated[activeIndex] = project;
    setProjects(updated);
  };

  const updateProjectCustomSections = (updater) => {
    setProjects((prev) =>
      prev.map((project, idx) => {
        if (idx !== activeIndex) return project;
        const currentSections = Array.isArray(project.customSections)
          ? project.customSections
          : [createCustomSection()];
        return {
          ...project,
          isCustom: true,
          customSections: updater(currentSections),
        };
      })
    );
  };

  const handleCustomSectionChange = (sectionIndex, field, value) => {
    updateProjectCustomSections((sections) =>
      sections.map((section, idx) =>
        idx === sectionIndex ? { ...section, [field]: value } : section
      )
    );
  };

  const handleAddCustomSection = () => {
    updateProjectCustomSections((sections) => [...sections, createCustomSection()]);
  };

  const handleDeleteCustomSection = (sectionIndex) => {
    updateProjectCustomSections((sections) => {
      if (sections.length <= 1) return sections;
      return sections.filter((_, idx) => idx !== sectionIndex);
    });
  };

  const moveCustomSection = (sectionIndex, direction) => {
    updateProjectCustomSections((sections) => {
      const nextIndex = sectionIndex + direction;
      if (nextIndex < 0 || nextIndex >= sections.length) return sections;
      const updated = [...sections];
      const temp = updated[sectionIndex];
      updated[sectionIndex] = updated[nextIndex];
      updated[nextIndex] = temp;
      return updated;
    });
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

  const uploadProjectImageFile = async (file) => {
    if (file.size > 15 * 1024 * 1024) {
      throw new Error('Image is too large. Max size is 15MB.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('Please upload an image file.');
    }

    setToast({ message: 'Uploading image...', type: 'success' });
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('admin_token');
    const response = await fetch('/api/upload-image', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload image.');
    }

    return data.imageUrl;
  };

  const handleProjectImageUpload = async (sectionIndex, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadProjectImageFile(file);
      handleCustomSectionChange(sectionIndex, 'imageSrc', imageUrl);
      handleCustomSectionChange(sectionIndex, 'imageAlt', activeProject?.title || file.name);
      setToast({ message: 'Image uploaded successfully! Click Save Changes to save.', type: 'success' });
    } catch (err) {
      console.error('Image upload failed:', err);
      setToast({ message: err.message || 'Network error uploading image.', type: 'error' });
    } finally {
      e.target.value = '';
    }
  };

  const handleTemplateImageUpload = async (slotKey, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = await uploadProjectImageFile(file);
      handleTemplateImageChange(slotKey, imageUrl);
      setToast({ message: 'Template image uploaded successfully! Click Save Changes to save.', type: 'success' });
    } catch (err) {
      console.error('Template image upload failed:', err);
      setToast({ message: err.message || 'Network error uploading image.', type: 'error' });
    } finally {
      e.target.value = '';
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
      isCustom: true,
      customSections: [createCustomSection()],
    };
    setProjects(renumberProjects([...projects, newProj]));
    setActiveIndex(projects.length);
    setToast({ message: 'New project created.', type: 'success' });
  };

  const saveProjectsToServer = async (nextProjects) => {
    const token = localStorage.getItem('admin_token');
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ projects: nextProjects }),
    });

    const data = await response.json();
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to save projects to server.');
    }

    return data;
  };

  const handleDeleteProject = async () => {
    if (projects.length <= 1) {
      setToast({ message: 'Cannot delete the only project.', type: 'error' });
      return;
    }
    const title = projects[activeIndex]?.title || 'this project';
    if (!window.confirm(`Delete "${title}"?\n\nThis will save the deletion immediately.`)) {
      return;
    }

    const previousProjects = projects;
    const previousActiveIndex = activeIndex;
    const nextProjects = renumberProjects(projects.filter((_, idx) => idx !== activeIndex));
    const nextActiveIndex = Math.min(activeIndex, nextProjects.length - 1);

    setProjects(nextProjects);
    setActiveIndex(nextActiveIndex);
    setIsSaving(true);
    setToast({ message: 'Deleting project...', type: 'success' });

    try {
      await saveProjectsToServer(nextProjects);
      setOriginalProjects(JSON.parse(JSON.stringify(nextProjects)));
      setToast({ message: 'Project deleted and saved successfully.', type: 'success' });
    } catch (err) {
      console.error('Delete project save failed:', err);
      setProjects(previousProjects);
      setActiveIndex(previousActiveIndex);
      setToast({ message: 'Delete failed. Project was restored because the server save did not complete.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
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
      const isPortfolio = activeTab === 'portfolio';
      if (isPortfolio) {
        await saveProjectsToServer(projects);
        setOriginalProjects(JSON.parse(JSON.stringify(projects)));
        setToast({ message: 'Projects configurations saved successfully!', type: 'success' });
      } else {
        const token = localStorage.getItem('admin_token');
        const response = await fetch('/api/demo', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ demoData: demos }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || 'Failed to save to server.');
        }

        setOriginalDemos(JSON.parse(JSON.stringify(demos)));
        setToast({ message: 'Featured Demo configuration saved successfully!', type: 'success' });
      }
    } catch (err) {
      console.error('Save to server failed:', err);
      setToast({
        message: err.message || 'Could not write to local server disk. Please export JSON file and replace it manually.',
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

  const renderVisitorPreview = () => {
    const isPortfolio = activeTab === 'portfolio';
    const previewIndex = isPortfolio ? activeIndex : activeDemoIndex;
    const previewPath = isPortfolio ? '/OurProjects/ProjectDetail' : '/OurProjects/DemoProject';
    const previewSrc = `${previewPath}?adminPreview=1&previewIndex=${previewIndex}&previewNonce=${previewNonce}`;
    const previewLabel = isPortfolio
      ? activeProject?.title || 'portfolio project'
      : activeDemo?.title || 'featured demo';

    return (
      <div className="editor-visitor-preview-shell">
        <div className="editor-visitor-preview-toolbar">
          <span className="pill-tag pill-tag--teal">Visitor Page Preview</span>
          <span className="editor-visitor-preview-title">{previewLabel}</span>
        </div>
        <iframe
          key={`${activeTab}-${previewIndex}-${previewNonce}`}
          className="editor-visitor-preview-frame"
          title={`Visitor preview: ${previewLabel}`}
          src={previewSrc}
        />
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

          <div
            ref={previewScrollRef}
            className="editor-preview-panel"
            tabIndex={-1}
            aria-label="Scrollable preview content"
          >
            {previewTab === 'visual' ? (
              renderVisitorPreview()
            ) : (
              isPortfolio ? renderPortfolioDiff() : renderDemoDiff()
            )}
          </div>

          <div className="editor-preview-scroll-note" aria-hidden="true">
            Scroll inside this preview to see all content
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
          <button className="editor-btn editor-btn--secondary" onClick={handleOpenPreview}>
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

                    {activeProjectTemplateImageSlots.length > 0 && (
                      <div className="editor-section-builder editor-template-image-builder">
                        <div className="editor-section-builder-header">
                          <div>
                            <h3 className="editor-section-title" style={{ margin: 0 }}>Template Images</h3>
                            <p className="editor-section-builder-help">
                              Replace images in this existing project template. Each image slot maps to the same location visitors see in the project pop-up.
                            </p>
                          </div>
                        </div>

                        <div className="editor-template-image-grid">
                          {activeProjectTemplateImageSlots.map((slot) => {
                            const customSrc = activeProject.templateImages?.[slot.key] || '';
                            const hasCustomSrc = typeof customSrc === 'string' && customSrc.trim();
                            const previewSrc = hasCustomSrc ? customSrc.trim() : slot.defaultSrc;
                            return (
                              <div key={slot.key} className="editor-template-image-card">
                                <div className="editor-template-image-preview">
                                  <img src={previewSrc} alt={`${slot.label} preview`} />
                                </div>

                                <div className="editor-template-image-body">
                                  <div className="editor-template-image-title-row">
                                    <label className="editor-label" htmlFor={`template-image-${slot.key}`}>{slot.label}</label>
                                    <span className={`pill-tag ${hasCustomSrc ? 'pill-tag--teal' : ''}`}>
                                      {hasCustomSrc ? 'Custom' : 'Default'}
                                    </span>
                                  </div>

                                  <div className="editor-upload-row editor-template-image-upload-row">
                                    <input
                                      id={`template-image-${slot.key}`}
                                      type="text"
                                      className="editor-input"
                                      value={customSrc}
                                      onChange={(e) => handleTemplateImageChange(slot.key, e.target.value)}
                                      placeholder={slot.defaultSrc}
                                    />
                                    <label className="editor-btn editor-btn--secondary editor-upload-btn">
                                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path>
                                      </svg>
                                      Upload Image
                                      <input
                                        type="file"
                                        accept="image/png,image/jpeg,image/webp,image/gif"
                                        style={{ display: 'none' }}
                                        onChange={(e) => handleTemplateImageUpload(slot.key, e)}
                                      />
                                    </label>
                                    <button
                                      type="button"
                                      className="editor-btn editor-btn--secondary editor-upload-btn"
                                      onClick={() => handleTemplateImageReset(slot.key)}
                                      disabled={!hasCustomSrc}
                                    >
                                      Reset
                                    </button>
                                  </div>

                                  <span className="editor-helper-text">Default location: {slot.defaultSrc}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {getProjectDetailOption(activeProject).value === 'isCustom' && (
                      <div className="editor-section-builder">
                        <div className="editor-section-builder-header">
                          <div>
                            <h3 className="editor-section-title" style={{ margin: 0 }}>Custom Detail Page Builder</h3>
                            <p className="editor-section-builder-help">
                              Upload images, write page sections, and choose where each image appears in the visitor preview.
                            </p>
                          </div>
                          <button type="button" className="editor-btn editor-btn--secondary" onClick={handleAddCustomSection}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                              <line x1="12" y1="5" x2="12" y2="19"></line>
                              <line x1="5" y1="12" x2="19" y2="12"></line>
                            </svg>
                            Add Section
                          </button>
                        </div>

                        {(Array.isArray(activeProject.customSections) && activeProject.customSections.length > 0
                          ? activeProject.customSections
                          : [createCustomSection()]
                        ).map((section, sectionIndex, sections) => (
                          <div key={sectionIndex} className="editor-custom-section-card">
                            <div className="editor-custom-section-toolbar">
                              <span className="pill-tag pill-tag--teal">Section {sectionIndex + 1}</span>
                              <div className="editor-custom-section-actions">
                                <button
                                  type="button"
                                  className="editor-item-action-btn"
                                  onClick={() => moveCustomSection(sectionIndex, -1)}
                                  disabled={sectionIndex === 0}
                                  title="Move section up"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="18 15 12 9 6 15"></polyline>
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  className="editor-item-action-btn"
                                  onClick={() => moveCustomSection(sectionIndex, 1)}
                                  disabled={sectionIndex === sections.length - 1}
                                  title="Move section down"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <polyline points="6 9 12 15 18 9"></polyline>
                                  </svg>
                                </button>
                                <button
                                  type="button"
                                  className="editor-item-action-btn editor-item-action-btn--danger"
                                  onClick={() => handleDeleteCustomSection(sectionIndex)}
                                  disabled={sections.length <= 1}
                                  title="Delete section"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                  </svg>
                                </button>
                              </div>
                            </div>

                            <div className="editor-custom-section-grid">
                              <div className="editor-field">
                                <label className="editor-label">Section Heading</label>
                                <input
                                  type="text"
                                  className="editor-input"
                                  value={section.heading || ''}
                                  onChange={(e) => handleCustomSectionChange(sectionIndex, 'heading', e.target.value)}
                                  placeholder="e.g. Prototype Overview"
                                />
                              </div>

                              <div className="editor-field">
                                <label className="editor-label">Image Placement</label>
                                <select
                                  className="editor-select"
                                  value={section.imagePosition || 'right'}
                                  onChange={(e) => handleCustomSectionChange(sectionIndex, 'imagePosition', e.target.value)}
                                >
                                  <option value="left">Image Left, Text Right</option>
                                  <option value="right">Text Left, Image Right</option>
                                  <option value="full">Full-width Image Above Text</option>
                                  <option value="image-only">Image Only</option>
                                  <option value="text-only">Text Only</option>
                                </select>
                              </div>

                              <div className="editor-field editor-field--span-all">
                                <label className="editor-label">Section Text</label>
                                <textarea
                                  className="editor-textarea"
                                  value={section.body || ''}
                                  onChange={(e) => handleCustomSectionChange(sectionIndex, 'body', e.target.value)}
                                  placeholder="Write the text that should appear in this part of the project page."
                                />
                              </div>

                              <div className="editor-field editor-field--span-all">
                                <label className="editor-label">Image File / URL</label>
                                <div className="editor-upload-row">
                                  <input
                                    type="text"
                                    className="editor-input"
                                    value={section.imageSrc || ''}
                                    onChange={(e) => handleCustomSectionChange(sectionIndex, 'imageSrc', e.target.value)}
                                    placeholder="Upload or paste image path, e.g. /uploads/project-image.png"
                                  />
                                  <label className="editor-btn editor-btn--secondary editor-upload-btn">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path>
                                    </svg>
                                    Upload Image
                                    <input
                                      type="file"
                                      accept="image/png,image/jpeg,image/webp,image/gif"
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleProjectImageUpload(sectionIndex, e)}
                                    />
                                  </label>
                                </div>
                              </div>

                              <div className="editor-field">
                                <label className="editor-label">Image Alt Text</label>
                                <input
                                  type="text"
                                  className="editor-input"
                                  value={section.imageAlt || ''}
                                  onChange={(e) => handleCustomSectionChange(sectionIndex, 'imageAlt', e.target.value)}
                                  placeholder="Describe the image for accessibility"
                                />
                              </div>

                              <div className="editor-field">
                                <label className="editor-label">Image Caption</label>
                                <input
                                  type="text"
                                  className="editor-input"
                                  value={section.imageCaption || ''}
                                  onChange={(e) => handleCustomSectionChange(sectionIndex, 'imageCaption', e.target.value)}
                                  placeholder="Optional caption under image"
                                />
                              </div>
                            </div>

                            {section.imageSrc && (
                              <div className="editor-upload-preview">
                                <img src={section.imageSrc} alt={section.imageAlt || section.heading || 'Project section preview'} />
                                <span>{section.imageCaption || section.imageSrc}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

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
