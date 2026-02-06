import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const location = useLocation();
  const userId = localStorage.getItem('userId');
  const userRole = localStorage.getItem('userRole');

  if (!userId) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    // Redirect to dashboard if role doesn't match
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
