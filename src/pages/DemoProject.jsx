import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/Projects.css';

const DEMO_HIGHLIGHTS = [
  { value: 'LiDAR', label: 'Obstacle sensing' },
  { value: 'CV', label: 'Visual detection' },
  { value: 'Realtime', label: 'Path correction' },
  { value: 'Autonomy', label: 'User remains in control' },
];

export default function DemoProject() {
  const navigate = useNavigate();
  const [videoFailed, setVideoFailed] = useState(false);
  const [avatarState, setAvatarState] = useState(() => {
    return window.currentAvatarState || { projectName: null, status: 'idle' };
  });

  useEffect(() => {
    const handleBroadcast = (e) => {
      const { projectName, status } = e.detail;
      setAvatarState({ projectName, status });
    };

    window.addEventListener('avatar-status-broadcast', handleBroadcast);
    return () => {
      window.removeEventListener('avatar-status-broadcast', handleBroadcast);
    };
  }, []);

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/OurProjects')} label="Back to Projects" />

      <div className="page-header">
        <span className="section-label">Live Demo</span>
        <h1 className="page-title">Featured Demo</h1>
        <p className="page-subtitle">Experience a featured smart mobility solution in action</p>
      </div>

      <div className="glass-card demo-section">
        <div className="demo-video-wrapper">
          {!videoFailed ? (
            <video
              className="demo-video"
              controls
              autoPlay
              muted
              loop
              playsInline
              src="/demo-video.mp4"
              onError={() => setVideoFailed(true)}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="demo-video-fallback" role="status">
              <h2>Demo video unavailable</h2>
              <p>The smart wheelchair summary is still available below.</p>
            </div>
          )}
        </div>

        <div className="demo-highlight-grid">
          {DEMO_HIGHLIGHTS.map((item) => (
            <div key={item.value} className="demo-highlight-item">
              <span className="demo-highlight-value">{item.value}</span>
              <span className="demo-highlight-label">{item.label}</span>
            </div>
          ))}
        </div>

        <h2 className="demo-content-title">How it works</h2>
        <button 
          className="avatar-explain-btn"
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('avatar-explain-project', {
              detail: {
                projectName: 'SmartWheelchair',
                projectTitle: 'Smart Wheelchair Demo (Featured Demo)',
                customPrompt: 'Explain the Smart Wheelchair Featured Demo project in detail. Describe how standard motorized wheelchairs are augmented with LiDAR sensors and Computer Vision (CV) algorithms to automatically detect obstacles in real-time, gently correcting the path to prevent collisions while preserving user autonomy.'
              }
            }));
          }}
          style={{ marginBottom: '1rem' }}
          aria-label="Ask avatar to explain the Smart Wheelchair demo"
        >
          {avatarState.projectName === 'SmartWheelchair' && avatarState.status === 'thinking' ? (
            <span className="speaker-thinking" style={{ marginRight: '6px' }} />
          ) : avatarState.projectName === 'SmartWheelchair' && avatarState.status === 'speaking' ? (
            <div className="speaker-waves animating" style={{ marginRight: '6px' }}>
              <span className="speaker-bar"></span>
              <span className="speaker-bar"></span>
              <span className="speaker-bar"></span>
            </div>
          ) : (
            <span className="avatar-explain-btn-sparkle">✨</span>
          )}
          {avatarState.projectName === 'SmartWheelchair' && avatarState.status === 'speaking'
            ? 'Avatar Explaining...'
            : avatarState.projectName === 'SmartWheelchair' && avatarState.status === 'thinking'
            ? 'Avatar Thinking...'
            : 'Listen to Avatar Explain'}
        </button>
        <p className="demo-content-desc">
          This demonstration highlights our integration of LiDAR sensors and Computer Vision (CV)
          algorithms onto a standard motorized wheelchair. The system automatically detects obstacles
          in real-time and gently corrects the user's path, preventing collisions while maintaining user autonomy.
        </p>

        <div className="demo-tag-container">
          {['LiDAR', 'Computer Vision', 'Real-time', 'Autonomous'].map(tag => (
            <span key={tag} className="pill-tag pill-tag--teal">{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
