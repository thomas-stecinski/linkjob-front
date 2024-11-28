import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const token = localStorage.getItem('token');

    if (loading) {
        return <div>Loading...</div>; 
    }

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
