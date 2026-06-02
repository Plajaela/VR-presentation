import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import LiveClock from './components/LiveClock';
import NetworkBackground from './components/NetworkBackground';
import ScrollProgress from './components/ScrollProgress';
import './styles/App.css';

const Home = lazy(() => import('./pages/Home'));
const Introduction = lazy(() => import('./pages/Introduction'));
const OurPartners = lazy(() => import('./pages/OurPartners'));
const OurProjects = lazy(() => import('./pages/OurProjects'));
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'));
const DemoProject = lazy(() => import('./pages/DemoProject'));
const CollaborationOpportunities = lazy(() => import('./pages/CollaborationOpportunities'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));
const HomeAssistant = lazy(() => import('./components/HomeAssistant'));

function RouteFallback() {
  return (
    <div className="route-fallback" role="status" aria-live="polite">
      <span className="route-fallback-spinner" />
      <span>Loading section</span>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="app-root">

        {/* Background elements stay persistent across all pages */}
        <NetworkBackground />
        <div className="bg-animation">
          <div className="bg-orb bg-orb-1"></div>
          <div className="bg-orb bg-orb-2"></div>
          <div className="bg-orb bg-orb-3"></div>
        </div>

        <LiveClock />

        {/* Reading-progress bar + back-to-top control, resets scroll per route */}
        <ScrollProgress />

        {/* The page-enter class ensures your fade-in animation still plays on route change */}
        <div className="page-transition page-enter">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/Home" element={<Home />} />
              <Route path="/Introduction" element={<Introduction />} />
              <Route path="/OurPartners" element={<OurPartners />} />
              <Route path="/OurProjects" element={<OurProjects />} />
              <Route path="/OurProjects/ProjectDetail" element={<ProjectDetail />} />
              <Route path="/OurProjects/DemoProject" element={<DemoProject />} />
              <Route path="/OurProjects/CollaborationOpportunities" element={<CollaborationOpportunities />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </div>
        
        {/* Global 3D Avatar Assistant */}
        <Suspense fallback={null}>
          <HomeAssistant />
        </Suspense>

      </div>
    </BrowserRouter>
  );
}

export default App;
