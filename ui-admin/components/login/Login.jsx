// LoginPage.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const API_ACCOUNTS = "http://localhost:5000/accounts";

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Vui lòng nhập Email và Mật khẩu.');
            return;
        }

        try {
            const res = await axios.post(`${API_ACCOUNTS}/login`, { email, password });
            
            const { token, user } = res.data;
            
            // 1. Lưu token và user info vào Local Storage
            localStorage.setItem('authToken', token);
            localStorage.setItem('userRole', user.role);
            localStorage.setItem('userId', user._id);
            
            // 2. Gọi hàm onLogin từ App (nếu dùng Context)
            if (onLogin) onLogin(user);

            // 3. Kiểm tra Role và điều hướng (Role Check)
            if (user.role === 'ADMIN') {
                navigate('/admin/dashboard');
            } else {
                // STUDENT hoặc Role khác
                navigate('/login'); // Hoặc trang phù hợp khác
            }

        } catch (err) {
            console.error('Login Error:', err);
            const errMsg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.';
            setError(errMsg);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-indigo-700">Đăng nhập</h2>
                
                {error && <div className="p-3 mb-4 bg-red-100 text-red-700 rounded-lg text-sm">{error}</div>}

                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        placeholder="admin@example.com"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-medium mb-2">Mật khẩu</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                        placeholder="••••••••"
                        required
                    />
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition duration-200"
                >
                    Đăng nhập
                </button>
            </form>
        </div>
    );
};

export default LoginPage;