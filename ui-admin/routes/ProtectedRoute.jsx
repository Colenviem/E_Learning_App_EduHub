// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

// Hook đơn giản để kiểm tra trạng thái đăng nhập
const useAuth = () => {
    // Lấy token và role từ Local Storage
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    return { token, role };
};

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { token, role } = useAuth();
    
    // 1. Nếu KHÔNG có token (chưa đăng nhập), chuyển hướng đến trang Login
    if (!token) {
        // Lưu lại đường dẫn hiện tại để sau khi đăng nhập thành công sẽ quay lại
        // (Đây là một bước tối ưu tùy chọn, nhưng nên có)
        return <Navigate to="/login" replace />;
    }
    
    // 3. Nếu ĐỦ điều kiện, cho phép truy cập nội dung con
    return children;
};

export default ProtectedRoute;