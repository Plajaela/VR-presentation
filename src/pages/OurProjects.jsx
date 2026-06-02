import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/Projects.css';

function ClipboardIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="9" y1="9" x2="15" y2="9"></line>
      <line x1="9" y1="13" x2="15" y2="13"></line>
      <line x1="9" y1="17" x2="13" y2="17"></line>
    </svg>
  );
}

function TargetIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="6"></circle>
      <circle cx="12" cy="12" r="2"></circle>
    </svg>
  );
}

function HandshakeIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 17 8 20a2.8 2.8 0 0 1-4-4l3-3"></path>
      <path d="m13 7 3-3a2.8 2.8 0 0 1 4 4l-3 3"></path>
      <path d="M8 13h3l2 2a2 2 0 0 0 3-2.6l-1-1.4"></path>
      <path d="m12 8 4 4"></path>
      <path d="m7 12 5-5"></path>
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  );
}

const categories = [
  { 
    id: 'ProjectDetail', 
    number: '3.1', 
    title: 'Each Project', 
    desc: 'Browse our extensive portfolio of assistive tech', 
    theme: 'teal',
    iconComponent: ClipboardIcon 
  },
  { 
    id: 'DemoProject', 
    number: '3.2', 
    title: 'Demo Project', 
    desc: 'Experience a featured smart mobility solution in action', 
    theme: 'violet',
    iconComponent: TargetIcon 
  },
  { 
    id: 'CollaborationOpportunities', 
    number: '3.3', 
    title: 'Collaborate', 
    desc: 'Find natural ways to partner with ETC on applied research', 
    theme: 'teal',
    iconComponent: HandshakeIcon 
  }
];

export default function OurProjects() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/Home')} />

      <div className="page-header">
        <span className="section-label">Portfolio</span>
        <h1 className="page-title">Our Projects</h1>
        <p className="page-subtitle">Innovating for inclusivity and empowerment</p>
      </div>

      <div className="projects-grid-wrapper">
        <div className="stagger-children projects-grid double-column">
          {categories.map((cat) => {
            const Icon = cat.iconComponent;
            return (
              <button
                key={cat.id}
                className={`glass-card project-category-card project-category-card--${cat.theme}`}
                onClick={() => navigate(`/OurProjects/${cat.id}`)}
                aria-label={`Explore ${cat.title}`}
              >
                {/* Visual glow element */}
                <div className={`project-category-glow project-category-glow--${cat.theme}`} />
                
                <div className="project-category-header">
                  <div className={`project-category-icon-wrapper project-category-icon-wrapper--${cat.theme}`}>
                    <Icon className="project-category-icon-svg" />
                  </div>
                  <span className={`pill-tag pill-tag--${cat.theme} project-category-badge`}>
                    {cat.number}
                  </span>
                </div>
                
                <div className="project-category-body">
                  <h2 className="project-category-title">{cat.title}</h2>
                  <p className="project-category-desc">{cat.desc}</p>
                </div>
                
                <div className={`project-explore-link project-explore-link--${cat.theme}`}>
                  <span>Explore</span>
                  <ChevronRightIcon className="explore-chevron" />
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
