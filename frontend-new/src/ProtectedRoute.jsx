import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from "./context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
    const { auth, loading } = useAuth();

    // Loading dikhao jab tak state load na ho
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-indigo-950">
                <p className="text-white text-2xl animate-pulse">Welcome back! Loading dashboard...</p>
            </div>
        );
    }

    if (!auth.user || auth.role !== 'admin') {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;