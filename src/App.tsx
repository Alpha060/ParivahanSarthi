import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MobileDrawer } from './components/MobileDrawer';

// Full Pages
import { HomePage } from './pages/HomePage';
import { ApplyPage } from './pages/ApplyPage';
import { StatusPage } from './pages/StatusPage';
import { AppointmentPage } from './pages/AppointmentPage';
import { FeeCalculatorPage } from './pages/FeeCalculatorPage';
import { RtoDirectoryPage } from './pages/RtoDirectoryPage';
import { GrievancePage } from './pages/GrievancePage';
import { LoginPage } from './pages/LoginPage';
import { ServicesCatalogPage } from './pages/ServicesCatalogPage';
import { MockTestPage } from './pages/MockTestPage';
import { NoticesPage } from './pages/NoticesPage';
import { CitizenCharterPage } from './pages/CitizenCharterPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { AccessibilityPage } from './pages/AccessibilityPage';
import { ApplicationsDashboardPage } from './pages/ApplicationsDashboardPage';
import { OfficerDashboardPage } from './pages/OfficerDashboardPage';
import { OfficerNotificationsPage } from './pages/OfficerNotificationsPage';
import { OfficerScrutinyPage } from './pages/OfficerScrutinyPage';
import { OfficerAdttPage } from './pages/OfficerAdttPage';
import { OfficerDlDispatchPage } from './pages/OfficerDlDispatchPage';
import { SuperAdminDashboardPage } from './pages/SuperAdminDashboardPage';
import { DoctorPortalPage } from './pages/DoctorPortalPage';
import { DtsPortalPage } from './pages/DtsPortalPage';
import { CounterDeskPage } from './pages/CounterDeskPage';
import { EnforcementPortalPage } from './pages/EnforcementPortalPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { BhashaSahayakWidget } from './components/BhashaSahayakWidget';
import { ErrorBoundary } from './components/ErrorBoundary';

// Global Modals
import { StateSelectorModal } from './components/Modals/StateSelectorModal';

/**
 * ScrollToTop Component: Guarantees every route transition scrolls window directly to top
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, currentState, setCurrentState } = useApp();
  const [isStateSelectorOpen, setIsStateSelectorOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState('Home');

  const handleOpenHome = () => {
    setActiveNavTab('Home');
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${
      darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F4F7FB] text-slate-800'
    }`}>
      
      {/* Scroll restoration */}
      <ScrollToTop />
      
      {/* 1. Mobile Drawer Navigation */}
      <MobileDrawer
        onOpenHome={handleOpenHome}
        onOpenLogin={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { state: { from: location } })}
        onOpenStateSelector={() => setIsStateSelectorOpen(true)}
        onOpenService={(serviceId) => navigate(`/apply/${serviceId}`)}
        onOpenServicesCatalog={() => navigate('/services')}
        onOpenStatus={() => navigate('/status')}
        onOpenAppointment={() => navigate('/appointments')}
        onOpenFee={() => navigate('/fees')}
        onOpenRto={() => navigate('/rto-directory')}
        onOpenSupport={() => navigate('/grievance')}
        onOpenMockTest={() => navigate('/mock-test')}
      />

      {/* 2. Top Header with Emblem, Translations, Theme & Login */}
      <Header onOpenLogin={() => navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { state: { from: location } })} onOpenHome={handleOpenHome} />

      {/* 3. Secondary Navigation Bar (Full-Page Router Driven) */}
      <Navbar
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onOpenHome={handleOpenHome}
        onOpenService={(serviceId) => navigate(`/apply/${serviceId}`)}
        onOpenRto={() => navigate('/rto-directory')}
        onOpenFee={() => navigate('/fees')}
        onOpenStatus={() => navigate('/status')}
        onOpenAppointment={() => navigate('/appointments')}
        onOpenSupport={() => navigate('/grievance')}
      />

      {/* Main Routed Content Area */}
      <main className="flex-1 pb-16 md:pb-0">
        <Routes>
          <Route path="/" element={<HomePage onOpenStateSelector={() => setIsStateSelectorOpen(true)} />} />
          <Route path="/services" element={<ServicesCatalogPage />} />
          <Route path="/mock-test" element={<MockTestPage />} />
          <Route 
            path="/apply/:serviceId" 
            element={
              <ProtectedRoute requiredRole="CITIZEN">
                <ApplyPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/status" element={<StatusPage />} />
          <Route path="/status/:id" element={<StatusPage />} />
          <Route 
            path="/applications" 
            element={
              <ProtectedRoute requiredRole="CITIZEN">
                <ApplicationsDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-applications" 
            element={
              <ProtectedRoute requiredRole="CITIZEN">
                <ApplicationsDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer-dashboard" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-dashboard" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <SuperAdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <SuperAdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/officers" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <SuperAdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin-officers" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <SuperAdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor-portal" 
            element={
              <ProtectedRoute requiredRole="MEDICAL_DOCTOR">
                <DoctorPortalPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/doctor/portal" 
            element={
              <ProtectedRoute requiredRole="MEDICAL_DOCTOR">
                <DoctorPortalPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dts-portal" 
            element={
              <ProtectedRoute requiredRole="DRIVING_SCHOOL">
                <DtsPortalPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dts/portal" 
            element={
              <ProtectedRoute requiredRole="DRIVING_SCHOOL">
                <DtsPortalPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/counter-desk" 
            element={
              <ProtectedRoute requiredRole="COUNTER_OPERATOR">
                <CounterDeskPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/counter/desk" 
            element={
              <ProtectedRoute requiredRole="COUNTER_OPERATOR">
                <CounterDeskPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/enforcement-portal" 
            element={
              <ProtectedRoute requiredRole="ENFORCEMENT_OFFICER">
                <EnforcementPortalPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/enforcement/portal" 
            element={
              <ProtectedRoute requiredRole="ENFORCEMENT_OFFICER">
                <EnforcementPortalPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer-notifications" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerNotificationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/notifications" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerNotificationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/scrutiny" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerScrutinyPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer-scrutiny" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerScrutinyPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/adtt-test-track" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerAdttPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer-adtt" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerAdttPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer/dl-dispatch" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerDlDispatchPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/officer-dl-dispatch" 
            element={
              <ProtectedRoute requiredRole="OFFICIAL">
                <OfficerDlDispatchPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/appointments" 
            element={
              <ProtectedRoute requiredRole="CITIZEN">
                <AppointmentPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/fees" element={<FeeCalculatorPage />} />
          <Route path="/fee-calculator" element={<FeeCalculatorPage />} />
          <Route path="/rto-directory" element={<RtoDirectoryPage />} />
          <Route path="/grievance" element={<GrievancePage />} />
          <Route path="/notices" element={<NoticesPage />} />
          <Route path="/citizen-charter" element={<CitizenCharterPage />} />
          <Route path="/terms" element={<CitizenCharterPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/accessibility" element={<AccessibilityPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Catch-all fallback */}
          <Route path="*" element={<HomePage onOpenStateSelector={() => setIsStateSelectorOpen(true)} />} />
        </Routes>
      </main>

      {/* 4. Comprehensive Dark Navy Footer */}
      <Footer />

      {/* 5. Mobile Persistent Bottom Navigation Bar */}
      <MobileBottomNav
        activeTab={activeNavTab}
        setActiveTab={setActiveNavTab}
        onOpenHome={handleOpenHome}
        onOpenService={(serviceId) => navigate(`/apply/${serviceId}`)}
        onOpenServicesCatalog={() => navigate('/services')}
        onOpenStatus={() => navigate('/status')}
        onOpenAppointment={() => navigate('/appointments')}
        onOpenSupport={() => navigate('/grievance')}
      />

      {/* Global State / UT Selector Modal */}
      <StateSelectorModal
        isOpen={isStateSelectorOpen}
        onClose={() => setIsStateSelectorOpen(false)}
        currentState={currentState}
        onSelectState={(st) => setCurrentState(st)}
      />

      {/* Bhasha Sahayak Voice AI Assistant for Citizens */}
      <BhashaSahayakWidget />

    </div>
  );
}

export function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AppProvider>
          <AppLayout />
        </AppProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
