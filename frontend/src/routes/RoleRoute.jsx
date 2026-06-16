import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function RoleRoute({ roles }) {
  const { user } = useAuth();

  if (!roles.includes(user?.role)) {
    return <Navigate to="/profile" replace />;
  }

  return <Outlet />;
}
