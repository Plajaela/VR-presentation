import { useNavigate } from 'react-router';
import BackButton from '../components/BackButton';

// Self-contained styles so the page renders correctly even on a direct hit,
// without depending on any route-level (lazy-loaded) stylesheet.
const primaryBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.85rem 1.6rem',
  borderRadius: 'var(--radius-pill)',
  background: 'var(--accent-gradient)',
  color: '#fff',
  fontWeight: 600,
  fontSize: '0.95rem',
  boxShadow: '0 10px 24px -6px rgba(31, 122, 107, 0.45)',
  transition: 'transform var(--transition), box-shadow var(--transition)',
};

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="page-container animate-fade-in">
      <BackButton onClick={() => navigate('/')} label="Back to Welcome Page" />

      <div
        className="page-header"
        style={{ textAlign: 'center', marginTop: 'clamp(3rem, 12vh, 8rem)' }}
      >
        <span className="section-label" style={{ justifyContent: 'center' }}>
          Page not found
        </span>
        <h1 className="page-title" style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}>
          404
        </h1>
        <p className="page-subtitle" style={{ maxWidth: '38ch', margin: '0 auto 1.75rem' }}>
          This section of the Enabling Technology Collaboratory doesn&apos;t exist.
          Let&apos;s get you back on track.
        </p>

        <button type="button" style={primaryBtnStyle} onClick={() => navigate('/Home')}>
          Go to Home
        </button>
      </div>
    </div>
  );
}
