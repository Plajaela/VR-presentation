import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/Projects.css';

export default function DemoProject() {
  const navigate = useNavigate();

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
          {/* 
            TODO: 
            1. Copy the Video ID from your YouTube link (e.g. for https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ)
            2. Replace "YOUR_YOUTUBE_VIDEO_ID_HERE" with that ID.
          */}
          <iframe 
            className="demo-video" 
            src="https://www.youtube.com/embed/YOUR_YOUTUBE_VIDEO_ID_HERE?autoplay=1&mute=1&loop=1&playlist=YOUR_YOUTUBE_VIDEO_ID_HERE" 
            title="YouTube video player" 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            referrerPolicy="strict-origin-when-cross-origin" 
            allowFullScreen
          ></iframe>
        </div>

        <h2 className="demo-content-title">How it works</h2>
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