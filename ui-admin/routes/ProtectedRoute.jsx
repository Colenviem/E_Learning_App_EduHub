import { Navigate } from "react-router-dom";

const useAuth = () => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    return { token, role };
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role } = useAuth();
    
    if (!token) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;