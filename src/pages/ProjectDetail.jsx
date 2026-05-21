import { useState } from 'react';
import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';
import '../styles/pages/Projects.css';

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

function MicIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8"></path>
    </svg>
  );
}

function UploadIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"></path>
    </svg>
  );
}

function MessageSquareIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  );
}

function BookOpenIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
  );
}

const projects = [
  {
    number: '01',
    title: 'Augmented Reality Application for Security Training',
    desc: 'Co-funded by SSG, utilizing image target tracking to simulate security incidents',
    tag: 'Security & VR/AR',
    color: '#0d9488',
    isArast: true,
    iconComponent: SecurityShieldIcon
  },
  {
    number: '02',
    title: 'Automated Risk Assessment for image-based hazard identification and mitigation (ARA)',
    desc: 'Streamlining workplace risk assessments by developing an automated identification system',
    tag: 'Safety & AI',
    color: '#7c3aed',
    isAra: true,
    iconComponent: AiScannerIcon
  },
  {
    number: '03',
    title: 'Pre-Procedure Evaluation System for MRI',
    desc: 'AR-based simulation that helps patients acclimatise before MRI scans',
    tag: 'Healthcare & VR',
    color: '#059669',
    isMri: true,
    iconComponent: MriHeartbeatIcon
  },
  {
    number: '04',
    title: 'Virtual Practice Environment for Oral Exam Preparation',
    desc: 'A virtual practice environment where students interact with an AI simulating a teacher for oral exam preparation',
    tag: 'Education & AI',
    color: '#0284c7',
    isOral: true,
    iconComponent: EducationIcon
  }
];

export default function ProjectDetail() {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/OurProjects')} label="Back to Projects" />

      <div className="page-header">
        <span className="section-label">Research & Dev</span>
        <h1 className="page-title">Project Portfolio</h1>
        <p className="page-subtitle">Browse our extensive portfolio of assistive tech</p>
      </div>

      <div className="stagger-children project-list">
        {projects.map((proj, index) => {
          const isExpanded = expandedIndex === index;
          const Icon = proj.iconComponent;
          return (
            <div 
              key={index} 
              className={`glass-card project-item-card ${isExpanded ? 'project-item-card--expanded' : ''}`}
              onClick={() => toggleExpand(index)}
              style={{ cursor: 'pointer' }}
            >
              {/* Left edge premium colored stripe indicator */}
              <div className="project-item-stripe" style={{ backgroundColor: proj.color }} />
              
              <div className="project-item-header">
                {/* Left leading: high-tech custom icon & low-opacity ID number */}
                <div className="project-item-leading">
                  <div 
                    className="project-item-icon-wrapper"
                    style={{
                      background: `${proj.color}08`,
                      borderColor: `${proj.color}1a`,
                      color: proj.color
                    }}
                  >
                    <Icon className="project-item-icon-svg" />
                  </div>
                  <span className="project-item-number" style={{ color: `${proj.color}20` }}>
                    {proj.number}
                  </span>
                </div>

                {/* Center content: custom tag and title & description */}
                <div className="project-item-info">
                  <div className="project-item-tag-row">
                    <span
                      className="project-tag"
                      style={{
                        background: `${proj.color}0a`,
                        color: proj.color,
                        borderColor: `${proj.color}20`
                      }}
                    >
                      <span className="project-tag-dot" style={{ backgroundColor: proj.color }} />
                      {proj.tag}
                    </span>
                  </div>
                  <h3 className="project-item-title">{proj.title}</h3>
                  <p className="project-item-desc">{proj.desc}</p>
                </div>

                {/* Right trailing: custom circular expand chevron button */}
                <div className="project-item-trailing">
                  <span 
                    className={`expand-chevron-btn ${isExpanded ? 'expand-chevron-btn--expanded' : ''}`}
                    style={{
                      background: isExpanded ? `${proj.color}15` : 'rgba(0, 0, 0, 0.03)',
                      color: isExpanded ? proj.color : 'var(--text-secondary)'
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </span>
                </div>
              </div>

              {isExpanded && proj.isArast && (
                <div className="arast-expanded-content" onClick={(e) => e.stopPropagation()}>
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container">
                    <h2 className="arast-main-title">Project Overview</h2>

                    {/* Section 1: AR Fire Simulation & Incident Types */}
                    <div className="arast-section">
                      <div className="arast-media-wrapper">
                        <img 
                          src="/arast_fire_simulation.png" 
                          alt="AR Fire Extinguisher Simulation" 
                          className="arast-media-img" 
                        />
                      </div>
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          Co-funded by SSG, the AR Application for Security Training (ARAST) utilise image target tracking methodology to simulate security incidents such as:
                        </p>
                        
                        <div className="arast-incident-grid">
                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--teal">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--teal">Fire</span>
                          </div>

                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--violet">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="9"></circle>
                                <circle cx="12" cy="12" r="5"></circle>
                                <path d="M12 2v4M12 18v4M2 12h4M18 12h4"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--violet">Improvised explosive device</span>
                          </div>

                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--teal">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M13.8 12H3"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--teal">Break-In</span>
                          </div>

                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--violet">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21l-4.3-4.3M19 11a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--violet">Suspicious Person</span>
                          </div>

                          <div className="arast-incident-item">
                            <div className="arast-icon-badge arast-icon-badge--teal">
                              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                              </svg>
                            </div>
                            <span className="arast-incident-label arast-incident-label--teal">Bag Search</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 2: Suspicious Package & Engagement Description */}
                    <div className="arast-section arast-section--reverse">
                      <div className="arast-text-content">
                        <p className="arast-paragraph arast-paragraph--large">
                          Various learning activities are employed to engage trainees including the opportunity to interact with augmented 3D objects like a suspicious package. Instant feedback and summary of learning points serve to deepen understanding and reinforce knowledge.
                        </p>
                      </div>
                      <div className="arast-media-wrapper">
                        <img 
                          src="/arast_package.png" 
                          alt="AR Suspicious Package" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 3: Analytics Dashboard & Security Agency Values */}
                    <div className="arast-section">
                      <div className="arast-media-wrapper">
                        <img 
                          src="/arast_dashboard.png" 
                          alt="Security Analytics Dashboard" 
                          className="arast-media-img" 
                        />
                      </div>
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          The application also comes equipped with a database and a real-time analytics dashboard that enables security agencies to:
                        </p>
                        
                        <div className="arast-value-list">
                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                                <line x1="8" y1="21" x2="16" y2="21"></line>
                                <line x1="12" y1="17" x2="12" y2="21"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Monitor the completion of training assignments and login attempts, among other
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Identify frequently made errors during the learning process
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="20" x2="18" y2="10"></line>
                                <line x1="12" y1="20" x2="12" y2="4"></line>
                                <line x1="6" y1="20" x2="6" y2="14"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Access performance insights by tracking officers' competencies
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              ARAST can also be used to supplement basic training in the WSQ security modules, enhancing the learning experience for role plays.
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Partnership Branding Footer */}
                    <div className="arast-branding-footer">
                      <span className="arast-brand-label">Brand partnered with</span>
                      <div className="certis-logo-wrapper">
                        <span className="certis-logo-text">CERTIS</span>
                        <div className="certis-logo-diamond">
                          <svg width="22" height="22" viewBox="0 0 100 100" fill="none">
                            {/* Blue Diamond Left */}
                            <path d="M50 15 L20 50 L50 85 Z" fill="#005A9C" />
                            {/* Orange Diamond Right */}
                            <path d="M50 15 L80 50 L50 85 Z" fill="#FF7900" opacity="0.95" />
                          </svg>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {isExpanded && proj.isAra && (
                <div className="arast-expanded-content" onClick={(e) => e.stopPropagation()}>
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container">
                    <h2 className="arast-main-title">Project Overview</h2>

                    {/* Section 1: Intro & System value propositions */}
                    <div className="arast-section">
                      <div className="arast-text-content">
                        <p className="arast-paragraph arast-paragraph--large" style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                          This project aims to streamline workplace risk assessments by developing an automated system that:
                        </p>
                        
                        <div className="arast-value-list" style={{ marginTop: '0.5rem' }}>
                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                <polyline points="21 15 16 10 5 21"></polyline>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Accepts workplace images to generate preliminary risk assessment (RA) forms.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                <path d="M12 8v4"></path>
                                <path d="M12 16h.01"></path>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Identifies hazards and categorizes them using official Ministry Of Manpower (MOM) classifications for data analysis and trending.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                                <line x1="12" y1="9" x2="12" y2="13"></line>
                                <line x1="12" y1="17" x2="12.01" y2="17"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Provides an interface for users to review, refine, and finalize RA forms.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                                <line x1="16" y1="13" x2="8" y2="13"></line>
                                <line x1="16" y1="17" x2="8" y2="17"></line>
                                <polyline points="10 9 9 9 8 9"></polyline>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Offers a management system to organize, track, and archive RA forms effectively.
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="arast-media-wrapper">
                        <img 
                          src="/ara_tablet.png" 
                          alt="Automated Risk Assessment Tablet View" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 2: Workflow & Dashboard */}
                    <div className="arast-section arast-section--reverse">
                      <div className="arast-text-content">
                        <h3 className="arast-section-subtitle" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-heading)', margin: '0 0 0.5rem 0' }}>Workflow:</h3>
                        
                        <div className="arast-value-list">
                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                <polyline points="17 8 12 3 7 8"></polyline>
                                <line x1="12" y1="3" x2="12" y2="15"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              The Risk Assessment team captures photographs of the workplace and uploads them to the system.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--violet">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              The system auto-generates a draft RA form, which the assessment team can review and adjust.
                            </span>
                          </div>

                          <div className="arast-value-row arast-value-row--teal">
                            <div className="arast-value-icon">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="16" y1="2" x2="16" y2="6"></line>
                                <line x1="8" y1="2" x2="8" y2="6"></line>
                                <line x1="3" y1="10" x2="21" y2="10"></line>
                              </svg>
                            </div>
                            <span className="arast-value-text">
                              Finalized forms are archived with tracking features for control measure implementation.
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="arast-media-wrapper">
                        <img 
                          src="/ara_dashboard.png" 
                          alt="RA Management Workflow Dashboard" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 3: Validation */}
                    <div className="arast-validation-section" style={{ padding: '0.5rem 0' }}>
                      <h3 className="arast-section-subtitle" style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-heading)', margin: '0 0 0.8rem 0' }}>Validation:</h3>
                      <p className="arast-paragraph" style={{ fontSize: '0.94rem', lineHeight: '1.65', color: 'var(--text-secondary)' }}>
                        The system’s effectiveness was assessed by comparing the quality and thoroughness of its outputs against manually created forms.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {isExpanded && proj.isMri && (
                <div className="arast-expanded-content" onClick={(e) => e.stopPropagation()}>
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container">
                    <h2 className="arast-main-title">Project Overview</h2>

                    {/* Section 1: Intro Text with Team Image */}
                    <div className="arast-section">
                      <div className="arast-media-wrapper">
                        <img 
                          src="/mri_team.png" 
                          alt="Pre-Procedure Evaluation System Team Collaboration" 
                          className="arast-media-img" 
                        />
                      </div>
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          The goal of the project, which received funding from the Temasek Polytechnic Research Fund (TPRF) and involved collaboration with CGH, was to decrease the incidence of MRI scans being aborted due to patients being unsuitable for the procedure. To achieve this objective, the project team created a functional prototype that:
                        </p>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 2: Side by Side Two Custom Cards */}
                    <div className="mri-cards-container">
                      <div className="mri-card mri-card--teal">
                        <div className="mri-card-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <circle cx="12" cy="12" r="4"></circle>
                            <path d="M12 2v2M12 20v2M2 12h2M20 12h2"></path>
                          </svg>
                        </div>
                        <p className="mri-card-text">
                          Simulates the MRI Scanning process through the use of immersive media/VR technology
                        </p>
                      </div>

                      <div className="mri-card mri-card--violet">
                        <div className="mri-card-icon">
                          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                          </svg>
                        </div>
                        <p className="mri-card-text">
                          Collects various data through the use of a body pressure distribution bed mat, vital sign monitoring devices and cameras resulting in establishing a basic scoring system
                        </p>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 3: Large System Architecture Diagram */}
                    <div className="mri-diagram-section">
                      <div className="arast-media-wrapper mri-diagram-wrapper">
                        <img 
                          src="/mri_architecture.png" 
                          alt="MRI System Workflow Architecture Diagram" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    {/* Section 4: Row of 4 Features */}
                    <div className="mri-features-row">
                      <div className="mri-feature-item mri-feature-item--teal">
                        <div className="mri-feature-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                          </svg>
                        </div>
                        <span className="mri-feature-label">Durable</span>
                      </div>

                      <div className="mri-feature-item mri-feature-item--violet">
                        <div className="mri-feature-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="6" width="18" height="15" rx="2"></rect>
                            <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
                          </svg>
                        </div>
                        <span className="mri-feature-label">Portable</span>
                      </div>

                      <div className="mri-feature-item mri-feature-item--teal">
                        <div className="mri-feature-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <circle cx="12" cy="12" r="6"></circle>
                            <circle cx="12" cy="12" r="2"></circle>
                          </svg>
                        </div>
                        <span className="mri-feature-label">Lightweight</span>
                      </div>

                      <div className="mri-feature-item mri-feature-item--violet">
                        <div className="mri-feature-icon">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                          </svg>
                        </div>
                        <span className="mri-feature-label">Easy to set up</span>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 5: Prior to Scan VR Immersion Setup */}
                    <div className="arast-section arast-section--reverse">
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          Prior to an MRI scan, a patient will be subjected to a simulated in-bore MRI environment using immersive media/VR technology while being monitored continuously to detect signs of anxiety or claustrophobic response. This will help determine the probability of success of an actual scan. A patient can also use the system to acclimatize themselves to the MRI scanning process.
                        </p>
                      </div>
                      <div className="arast-media-wrapper">
                        <img 
                          src="/mri_patient.png" 
                          alt="Patient acclimatization simulation room setup" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    {/* Partner Branding Footer */}
                    <div className="arast-branding-footer">
                      <span className="arast-brand-label">Brand partnered with</span>
                      <div className="cgh-logo-wrapper">
                        <div className="cgh-logo-content">
                          <svg width="22" height="22" viewBox="0 0 100 100" fill="none" className="cgh-logo-svg">
                            <rect x="38" y="15" width="24" height="70" fill="#005A9C" rx="2" />
                            <rect x="15" y="38" width="70" height="24" fill="#005A9C" rx="2" />
                            <rect x="42" y="19" width="16" height="62" fill="#FFF" rx="1" />
                            <rect x="19" y="42" width="62" height="16" fill="#FFF" rx="1" />
                            <circle cx="50" cy="50" r="10" fill="#FF7900" />
                          </svg>
                          <div className="cgh-logo-text-container">
                            <span className="cgh-text-primary">Changi General Hospital</span>
                            <span className="cgh-text-secondary">SingHealth</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

              {isExpanded && proj.isOral && (
                <div className="arast-expanded-content" onClick={(e) => e.stopPropagation()}>
                  <div className="arast-divider"></div>
                  
                  <div className="arast-container">
                    <h2 className="arast-main-title">Project Overview</h2>

                    {/* Section 1: Overview and main illustration */}
                    <div className="oral-overview-section">
                      <p className="arast-paragraph">
                        This project creates a virtual practice environment where students interact with an AI simulating a teacher for oral exam preparation.
                      </p>
                      
                      <div className="arast-media-wrapper oral-media-overview">
                        <img 
                          src="/oral_exam_overview.png" 
                          alt="AI Oral Exam Practice Environment Illustration" 
                          className="arast-media-img" 
                        />
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 2: Four Detailed Features Blocks */}
                    <div className="oral-features-container">
                      <div className="oral-feature-card oral-feature-card--teal">
                        <div className="oral-feature-card-icon">
                          <MicIcon className="oral-icon-svg" />
                        </div>
                        <p className="oral-feature-card-text">
                          Using voice-to-text, large language models (LLM), and text-to-voice technologies, it provides an interactive learning experience tailored to individual needs.
                        </p>
                      </div>

                      <div className="oral-feature-card oral-feature-card--violet">
                        <div className="oral-feature-card-icon">
                          <UploadIcon className="oral-icon-svg" />
                        </div>
                        <p className="oral-feature-card-text">
                          Teachers can upload visual stimuli, exam topics, and assessment rubrics, allowing the AI to guide students through practice sessions resembling the actual exam.
                        </p>
                      </div>

                      <div className="oral-feature-card oral-feature-card--teal">
                        <div className="oral-feature-card-icon">
                          <MessageSquareIcon className="oral-icon-svg" />
                        </div>
                        <p className="oral-feature-card-text">
                          At the end of each session, the AI generates personalized feedback based on the rubrics, helping students identify areas for improvement and adjust their performance in real-time.
                        </p>
                      </div>

                      <div className="oral-feature-card oral-feature-card--violet">
                        <div className="oral-feature-card-icon">
                          <BookOpenIcon className="oral-icon-svg" />
                        </div>
                        <p className="oral-feature-card-text">
                          Teachers can review the AI-generated feedback to ensure accuracy. Overall, the proposal offers an effective, scalable solution for oral exam preparation, empowering students to practice independently and improve their performance for better results.
                        </p>
                      </div>
                    </div>

                    <div className="arast-divider-sub"></div>

                    {/* Section 3: Pilot Testing */}
                    <div className="oral-pilot-section">
                      <div className="arast-media-wrapper oral-pilot-media">
                        <img 
                          src="/oral_exam_pilot.png" 
                          alt="Pilot testing classroom environment" 
                          className="arast-media-img" 
                        />
                      </div>
                      <div className="arast-text-content">
                        <p className="arast-paragraph">
                          Pilot testing will be conducted in a controlled environment at both Dunman Secondary School and Bartley Secondary School.
                        </p>
                      </div>
                    </div>

                    {/* Partner Branding Footer */}
                    <div className="arast-branding-footer">
                      <span className="arast-brand-label">Brand partnered with</span>
                      <div className="oral-logos-container">
                        <div className="oral-logo-item">
                          <img src="/dunman_logo.png" alt="Dunman Secondary School" className="oral-partner-logo-img" />
                          <span className="oral-partner-logo-name">Dunman Secondary School</span>
                        </div>
                        <div className="oral-logo-item">
                          <img src="/bartley_logo.png" alt="Bartley Secondary School" className="oral-partner-logo-img" />
                          <span className="oral-partner-logo-name">Bartley Secondary School</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}