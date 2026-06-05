import { useState } from 'react';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { FarmerRegistry } from './pages/FarmerRegistry';
import { SoilReadingEntry } from './pages/SoilReadingEntry';
import { ReportGenerator } from './pages/ReportGenerator';
import type { IUser } from './types/database';

/**
 * Main application entry component. Manages root-level routing between
 * the landing page ('home'), authentication screen ('login'), and portal ('app').
 */
function App() {
  const [page, setPage] = useState<'home' | 'login' | 'app'>('home');
  const [activeTab, setActiveTab] = useState<'registry' | 'test' | 'reports'>('registry');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [, setCurrentUser] = useState<IUser | null>(null);

  /**
   * Callback executed when a new soil test is completed. 
   * Updates state and redirects navigation to reports tab.
   * 
   * @param reportId The ID of the freshly generated report.
   */
  const handleReportGenerated = (reportId: string) => {
    setSelectedReportId(reportId);
    setActiveTab('reports');
  };

  /**
   * Callback triggered upon successful authentication. Sets session user 
   * and opens the technician portal.
   * 
   * @param user The authenticated user object.
   */
  const handleLoginSuccess = (user: IUser) => {
    setCurrentUser(user);
    setPage('app');
  };

  /**
   * Clears the current user session and returns to the landing page.
   */
  const handleLogOut = () => {
    setCurrentUser(null);
    setPage('home');
  };

  if (page === 'home') {
    return <LandingPage onLaunch={() => setPage('login')} />;
  }

  if (page === 'login') {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onBackToHome={() => setPage('home')} 
      />
    );
  }

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      onExit={handleLogOut}
    >
      {activeTab === 'registry' && <FarmerRegistry />}
      {activeTab === 'test' && (
        <SoilReadingEntry onReportGenerated={handleReportGenerated} />
      )}
      {activeTab === 'reports' && (
        <ReportGenerator 
          selectedReportId={selectedReportId} 
          setSelectedReportId={setSelectedReportId} 
        />
      )}
    </Layout>
  );
}

export default App;
