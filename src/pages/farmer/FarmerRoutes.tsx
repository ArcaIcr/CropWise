import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Lazy load farmer pages for code splitting
const FarmerDashboard = lazy(() => import('./FarmerDashboard').then(m => ({ default: m.FarmerDashboard })));
const FarmerReportView = lazy(() => import('./FarmerReportView').then(m => ({ default: m.FarmerReportView })));
const SoilReadingDetail = lazy(() => import('./SoilReadingDetail').then(m => ({ default: m.SoilReadingDetail })));
const FarmerLogin = lazy(() => import('./FarmerLogin').then(m => ({ default: m.FarmerLogin })));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export function FarmerRoutes() {
  const { user } = useAuth();

  // If not logged in as farmer, only allow access to login page. Redirect other requests.
  if (!user || user.role !== 'farmer') {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="login" element={<FarmerLogin />} />
          <Route path="*" element={<Navigate to="/farmer/login" replace />} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route index element={<FarmerDashboard />} />
        <Route path="reports" element={<FarmerReportView />} />
        <Route path="reports/:reportId" element={<FarmerReportView />} />
        <Route path="reading/:readingId" element={<SoilReadingDetail />} />
        <Route path="*" element={<Navigate to="/farmer" replace />} />
      </Routes>
    </Suspense>
  );
}