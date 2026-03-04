// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuthStore } from "../stores/useAuthStore";
import type { Role } from '../utils/rbac';
import { hasRole } from '../utils/rbac';

interface ProtectedRouteProps {
    allowedRoles: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    // 1. Si no hay usuario en el store, redirigir al login
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 2. Si hay usuario pero no tiene el rol permitido, redirigir a No Autorizado
    if (!hasRole(user.role, allowedRoles)) {
        return <Navigate to="/unauthorized" replace />;
    }

    // 3. Si todo está bien, renderizar las rutas hijas
    return <Outlet />;
};