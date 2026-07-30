import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { FarmerRegistry } from './pages/FarmerRegistry';
import { SoilReadingEntry } from './pages/SoilReadingEntry';
import { ReportGenerator } from './pages/ReportGenerator';
import { AdvisorDashboard } from './pages/AdvisorDashboard';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<'home' | 'login' | 'app'>('home');
  const [activeTab, setActiveTab] = useState<'registry' | 'test' | 'reports' | 'advisor'>('registry');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('farmer-juan-santos');
  const [selectedPlotId, setSelectedPlotId] = useState<string>('plot-kalinawan');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-zinc-400 text-sm">Loading session...</span>
        </div>
      </div>
    );
  }

  const handleReportGenerated = (reportId: string) => {
    setSelectedReportId(reportId);
    setActiveTab('reports');
  };

  const handleLoginSuccess = () => {
    setPage('app');
  };

  const handleLogOut = async () => {
    const { signOut } = useAuth();
    await signOut();
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

  if (!user) {
    return <LandingPage onLaunch={() => setPage('login')} />;
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
          onViewInAdvisor={(farmerId, plotId) => {
            setSelectedFarmerId(farmerId);
            setSelectedPlotId(plotId);
            setActiveTab('advisor');
          }}
        />
      )}
      {activeTab === 'advisor' && (
        <AdvisorDashboard 
          selectedFarmerId={selectedFarmerId}
          setSelectedFarmerId={setSelectedFarmerId}
          selectedPlotId={selectedPlotId}
          setSelectedPlotId={setSelectedPlotId}
          onViewReport={(reportId) => {
            setSelectedReportId(reportId);
            setActiveTab('reports');
          }}
          onLogout={handleLogOut} 
        />
      )}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;