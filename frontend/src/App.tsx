import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { useAuth } from './hooks/useAuth';
import { Toaster } from 'sonner';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InvestmentsPage from './pages/InvestmentsPage';
import TransactionsPage from './pages/TransactionsPage';

import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import ProtectedRoute from './components/ProtectedRoute';

function AppRoutes() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route
                    path="/login"
                    element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
                />
                <Route
                    path="/register"
                    element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
                />

                {/* Protected Routes */}
                <Route path="/" element={<ProtectedRoute />}>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="investments" element={<InvestmentsPage />} />
                        <Route path="transactions" element={<TransactionsPage />} />
                    </Route>
                </Route>

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppRoutes />
            <Toaster
                position="top-right"
                richColors
                closeButton
                duration={4000}
            />
        </AuthProvider>
    );
}

export default App;