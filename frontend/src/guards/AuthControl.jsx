import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export const PublicRoute = () => {
    const { user, loading, redirecting } = useAuth();

    if (loading) {
        return <div className="spinner">Cargando sesión...</div>;
    }
    return !user || redirecting ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export const RequireAuth = () => {
    const { user, loading, } = useAuth();

    if (loading) {
        return <div className="spinner">Cargando sesión...</div>;
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};
