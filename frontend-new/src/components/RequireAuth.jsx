import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();

    // Agar user ka role allowedRoles mai hai to content dikhao

    return (
        auth?.role && allowedRoles?.includes(auth.role)
            ? <Outlet />
            : auth?.user // Agar user logged in hai par role match nhi hua
                ? <Navigate to='/unauthorized' state={{ from: location }} replace />
                : <Navigate to='/login' state={{ from: location }} replace /> // Logged out
    );
}

export default RequireAuth;