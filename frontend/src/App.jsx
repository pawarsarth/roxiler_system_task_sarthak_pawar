import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import './styles.css';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/Admin/Dashboard';
import AdminUsers from './pages/Admin/Users';
import AdminStores from './pages/Admin/Stores';
import UserStores from './pages/User/Stores';
import StoreOwnerDashboard from './pages/StoreOwner/Dashboard';
import Navigation from './components/Navigation';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container"><div className="loading">Loading...</div></div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/login" />;
  }

  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navigation />}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminStores />
            </ProtectedRoute>
          }
        />

        {/* User Routes */}
        <Route
          path="/user/stores"
          element={
            <ProtectedRoute requiredRole="NORMAL_USER">
              <UserStores />
            </ProtectedRoute>
          }
        />

        {/* Store Owner Routes */}
        <Route
          path="/store-owner/dashboard"
          element={
            <ProtectedRoute requiredRole="STORE_OWNER">
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect */}
        <Route path="/" element={<Navigate to={user ? '/user/stores' : '/login'} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
