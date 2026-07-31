import { useState, useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { FarmerRegistry } from './pages/FarmerRegistry';
import { SoilReadingEntry } from './pages/SoilReadingEntry';
import { ReportGenerator } from './pages/ReportGenerator';
import { AdvisorDashboard } from './pages/AdvisorDashboard';

// Lazy load farmer routes for code splitting
const FarmerRoutes = lazy(() => import('./pages/farmer/FarmerRoutes').then(m => ({ default: m.FarmerRoutes })));
const FarmerLogin = lazy(() => import('./pages/farmer/FarmerLogin').then(m => ({ default: m.FarmerLogin })));

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <span className="text-zinc-400 text-sm">Loading...</span>
      </div>
    </div>
  );
}

function AppContent() {
  const { user, loading, signOut } = useAuth();
  const [page, setPage] = useState<'home' | 'login' | 'app' | 'farmer'>('home');
  const [activeTab, setActiveTab] = useState<'registry' | 'test' | 'reports' | 'advisor'>('registry');
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [selectedFarmerId, setSelectedFarmerId] = useState<string>('farmer-juan-santos');
  const [selectedPlotId, setSelectedPlotId] = useState<string>('plot-kalinawan');

  // Sync page state with active session
  useEffect(() => {
    if (!loading) {
      if (user) {
        if (user.role === 'farmer' && page === 'home') {
          setPage('farmer');
        } else if (user.role !== 'farmer') {
          if (page === 'home' || page === 'login') {
            setPage('app');
          } else if (page === 'farmer') {
            setPage('home');
          }
        }
      }
    }
  }, [user, loading, page]);

  if (loading) {
    return <LoadingFallback />;
  }

  const handleReportGenerated = (reportId: string) => {
    setSelectedReportId(reportId);
    setActiveTab('reports');
  };

  const handleLoginSuccess = () => {
    setPage('app');
  };

  const handleLogOut = async () => {
    await signOut();
    setPage('home');
  };

// Render farmer routes when page is 'farmer'
  const renderFarmerRoutes = () => {
    return (
      <Routes>
        <Route path="/farmer/login" element={<FarmerLogin />} />
        <Route path="/farmer/*" element={<FarmerRoutes />} />
        <Route path="/" element={<Navigate to="/farmer" replace />} />
      </Routes>
    );
  };

  if (page === 'home') {
    return <LandingPage onLaunch={(target) => setPage(target ?? 'login')} />;
  }

  if (page === 'login') {
    return (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onBackToHome={() => setPage('home')} 
      />
    );
  }

  if (page === 'farmer') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        {renderFarmerRoutes()}
      </Suspense>
    );
  }

  if (!user) {
    return <LandingPage onLaunch={(target) => setPage(target ?? 'login')} />;
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
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;