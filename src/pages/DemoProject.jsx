import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import AvatarExplainButton from '../components/AvatarExplainButton';
import { useAvatarStatus } from '../hooks/useAvatarStatus';
import '../styles/pages/Projects.css';

const SHOW_PAGE_DELAY = 1200; // show the demo page first, THEN pop the video
const SPOTLIGHT_EXIT_MS = 440; // matches the CSS fade-out
const DEMO_PREVIEW_STORAGE_KEY = 'admin_demo_preview_demos';

const DEFAULT_DEMO_DATA = {
  title: 'Featured Demo',
  subtitle: 'Experience a featured serious training simulation in action',
  videoSrc: '/demo-video.mp4',
  howItWorksTitle: 'How it works',
  description: "This featured demo places trainees inside a virtual emergency department where they practise thinking like junior doctors under pressure. They observe the patient's condition, decide what action is needed, request the right medicine, and verify the delivered medication before it is used. Each run is recorded, turning a rare high-stakes scenario into repeatable practice with clear review points for feedback and improvement.",
  highlights: [
    { value: 'VR Simulation', label: 'Emergency Scenario' },
    { value: 'Verification', label: 'Step-by-step checks' },
    { value: 'Procedure', label: 'Verify medicine orders' },
    { value: 'Video Log', label: 'Review & self-improvement' },
  ],
  avatar: {
    projectName: 'PatientSafetyVR',
    projectTitle: 'Patient Safety VR Training (Featured Demo)',
    customPrompt: "Explain the Patient Safety VR Training featured demo in an engaging way. Describe a trainee stepping into a virtual emergency department as a junior doctor, checking the patient's condition, deciding what action to take, ordering the correct medicine, verifying the delivered medicine before use, and reviewing the recorded session afterward for feedback and improvement. Keep it clear, lively, and suitable for visitors watching the demo video."
  },
  tags: ['Virtual Reality', 'Emergency Protocol', 'Patient Safety', 'Video Feedback']
};

// demo.json historically held a single demo object; newer saves hold an array.
const normalizeDemos = (data) => {
  if (Array.isArray(data)) return data.filter((d) => d && typeof d === 'object');
  if (data && typeof data === 'object') return [data];
  return [];
};

const getInitialDemoPreviewState = () => {
  if (typeof window === 'undefined') {
    return { demos: [DEFAULT_DEMO_DATA], activeIdx: 0, fromAdminPreview: false };
  }

  const params = new URLSearchParams(window.location.search);
  const fromAdminPreview = params.get('adminPreview') === '1';
  if (!fromAdminPreview) {
    return { demos: [DEFAULT_DEMO_DATA], activeIdx: 0, fromAdminPreview: false };
  }

  try {
    const previewIndex = Number.parseInt(params.get('previewIndex') || '', 10);
    const demos = normalizeDemos(JSON.parse(sessionStorage.getItem(DEMO_PREVIEW_STORAGE_KEY) || '[]'));
    if (demos.length > 0) {
      return {
        demos,
        activeIdx: Number.isInteger(previewIndex) && demos[previewIndex] ? previewIndex : 0,
        fromAdminPreview: true,
      };
    }
  } catch (err) {
    console.warn('Failed to load admin demo preview data:', err);
  }

  return { demos: [DEFAULT_DEMO_DATA], activeIdx: 0, fromAdminPreview: false };
};

export default function DemoProject() {
  const navigate = useNavigate();
  const [videoFailed, setVideoFailed] = useState(false);
  const avatarState = useAvatarStatus();
  const [initialPreviewState] = useState(getInitialDemoPreviewState);
  const [demos, setDemos] = useState(initialPreviewState.demos);
  const [activeIdx, setActiveIdx] = useState(initialPreviewState.activeIdx);
  const isAdminPreview = initialPreviewState.fromAdminPreview;

  const demoData = demos[activeIdx] || demos[0] || DEFAULT_DEMO_DATA;

  useEffect(() => {
    if (isAdminPreview) return;

    fetch('/demo.json')
      .then((res) => res.json())
      .then((data) => {
        const list = normalizeDemos(data);
        if (list.length > 0) {
          setDemos(list);
        }
      })
      .catch((err) => {
        console.error('Failed to load demo configuration:', err);
      });
  }, [isAdminPreview]);

  const selectDemo = (idx) => {
    if (idx === activeIdx) return;
    setActiveIdx(idx);
    setVideoFailed(false); // give the new demo's video a fresh chance to load
  };

  // While the avatar narrates this page, spotlight the demo video by popping it
  // to the centre of the screen over a dimmed backdrop. It is rendered through a
  // portal to <body> so it isn't clipped/blurred by the glass-card it lives in.
  const presenting = !isAdminPreview && avatarState.status === 'speaking';
  const [spotlight, setSpotlight] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (presenting) {
      // Let the page show for a beat first, then pop the video into the spotlight.
      const showTimer = setTimeout(() => {
        setSpotlight(true);
        setLeaving(false);
      }, SHOW_PAGE_DELAY);
      return () => clearTimeout(showTimer);
    }

    // Narration ended — play the exit animation, then drop out of spotlight.
    const leaveId = requestAnimationFrame(() => setLeaving(true));
    const offTimer = setTimeout(() => {
      setSpotlight(false);
      setLeaving(false);
    }, SPOTLIGHT_EXIT_MS);
    return () => {
      cancelAnimationFrame(leaveId);
      clearTimeout(offTimer);
    };
  }, [presenting]);

  return (
    <div className={`page-container animate-fade-in ${isAdminPreview ? 'demo-admin-preview' : ''}`}>
      {!isAdminPreview && <BackButton onClick={() => navigate('/OurProjects')} label="Back to Projects" />}

      {!isAdminPreview && (
        <div className="page-header">
          <span className="section-label">Live Demo</span>
          <h1 className="page-title">{demoData.title}</h1>
          <p className="page-subtitle">{demoData.subtitle}</p>
        </div>
      )}

      {/* Selector strip — only shown when more than one demo is configured */}
      {!isAdminPreview && demos.length > 1 && (
        <div className="demo-selector-strip" role="tablist" aria-label="Choose a featured demo">
          {demos.map((demo, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIdx}
              className={`demo-selector-btn ${idx === activeIdx ? 'demo-selector-btn--active' : ''}`}
              onClick={() => selectDemo(idx)}
            >
              {demo.title || `Demo ${idx + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="glass-card demo-section">
        <div className="demo-video-wrapper">
          {!videoFailed && demoData.videoSrc ? (
            <video
              key={`${activeIdx}-${demoData.videoSrc}`}
              className="demo-video"
              controls
              autoPlay
              muted
              loop
              playsInline
              src={demoData.videoSrc}
              onError={() => setVideoFailed(true)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="demo-video-fallback" role="status">
              <h2>Demo video unavailable</h2>
              <p>The serious training summary is still available below.</p>
            </div>
          )}
        </div>

        <div className="demo-highlight-grid">
          {(demoData.highlights || []).filter((h) => h.value || h.label).map((item, idx) => (
            <div key={idx} className="demo-highlight-item">
              <span className="demo-highlight-value">{item.value}</span>
              <span className="demo-highlight-label">{item.label}</span>
            </div>
          ))}
        </div>

        <h2 className="demo-content-title">{demoData.howItWorksTitle}</h2>
        {!isAdminPreview && (
          <AvatarExplainButton
            projectName={demoData.avatar?.projectName || 'PatientSafetyVR'}
            projectTitle={demoData.avatar?.projectTitle || 'Patient Safety VR Training (Featured Demo)'}
            customPrompt={demoData.avatar?.customPrompt}
            avatarState={avatarState}
            style={{ marginBottom: '1rem' }}
          />
        )}
        <p className="demo-content-desc">
          {demoData.description}
        </p>

        <div className="demo-tag-container">
          {(demoData.tags || []).filter(Boolean).map(tag => (
            <span key={tag} className="pill-tag pill-tag--teal">{tag}</span>
          ))}
        </div>
      </div>

      {/* Spotlight overlay — portalled to <body> so it fills the viewport and is
          never clipped by the glass-card's overflow/backdrop-filter. */}
      {!isAdminPreview && spotlight && !videoFailed && demoData.videoSrc && createPortal(
        <div className={`demo-spotlight ${leaving ? 'is-leaving' : ''}`} aria-hidden="true">
          <video
            key={`${activeIdx}-${demoData.videoSrc}`}
            className="demo-spotlight-video"
            autoPlay
            muted
            loop
            playsInline
            src={demoData.videoSrc}
          />
        </div>,
        document.body
      )}
    </div>
  );
}
