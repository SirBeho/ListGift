import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';

export const RequireAuth = () => {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div className="spinner">Cargando sesión...</div>;
    }
    return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
};

export const PublicRoute = () => {
    const { user, loading } = useAuth();

    if (loading) return null; // Esperamos a que el AuthProvider verifique la cookie

    console.log(user)
    // Si hay usuario, lo "expulsamos" al dashboard
    // Si NO hay usuario (es un invitado), lo dejamos pasar al Outlet
    return user
        ? <Navigate to="/dashboard" replace />
        : <Outlet />;
};

