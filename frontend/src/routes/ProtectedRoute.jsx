import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingState } from '../components/common/StateViews.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function ProtectedRoute() {
  const { loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingState label="Memeriksa sesi" />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
