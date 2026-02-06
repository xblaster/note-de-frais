import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ExpenseListPage from './pages/ExpenseListPage';
import CreateExpensePage from './pages/CreateExpensePage';
import ExpenseEditPage from './pages/ExpenseEditPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ProtectedRoute from './components/ProtectedRoute';

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
          path="/login"
          element={<LoginPage />}
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
          path="/admin"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboardPage />
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
        <Route
          path="/expenses/edit/:id"
          element={
            <ProtectedRoute>
              <ExpenseEditPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}