import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { isTokenExpired } from '../utils/token';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, token, logout } = useAuth();

  if (token && isTokenExpired(token)) {
    logout();
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}
