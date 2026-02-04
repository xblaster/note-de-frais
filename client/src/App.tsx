import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ExpenseListPage from './pages/ExpenseListPage';
import CreateExpensePage from './pages/CreateExpensePage';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const userId = localStorage.getItem('userId');

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={userId ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ExpenseListPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expenses/new"
          element={
            <ProtectedRoute>
              <CreateExpensePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
