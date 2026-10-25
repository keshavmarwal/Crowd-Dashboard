import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/Login';


const Overview = lazy(() => import('./pages/Overview'));
const CrowdEntries = lazy(() => import('./pages/CrowdEntries'));

const PageFallback = (
  <p className="py-20 text-center text-muted" role="status">
    Loading…
  </p>
);

export default function App() {
  return (
    <Suspense fallback={PageFallback}>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Overview />} />
            <Route path="/entries" element={<CrowdEntries />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
