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
            1. Copy your compressed video file into the "public" folder of this project.
            2. Rename the file to "demo-video.mp4" (or change the src below to match your filename).
          */}
          <video 
            className="demo-video" 
            controls 
            autoPlay 
            muted 
            loop 
            playsInline
            src="/demo-video.mp4"
            poster="/demo-poster.jpg"
          >
            Your browser does not support the video tag.
          </video>
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