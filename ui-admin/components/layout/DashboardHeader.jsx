import { apiClient, endpoints } from '../../src/api';
import React, { useCallback, useEffect, useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const DashboardHeader = () => {
    const [profile, setProfile] = useState({
        email: "",
        role: "",
        name: "",
        avatarUrl: ""
    });

    const fetchAccountInfo = useCallback(async () => {
        const accountId = localStorage.getItem('userId'); 
        if (!accountId) return;

        try {
            const res = await apiClient.get(`${endpoints.accounts}/profile/${accountId}`);

            setProfile({
                email: res.data.account?.email || "",
                role: res.data.account?.role || "",
                name: res.data.user?.name || "",
                avatarUrl: res.data.user?.avatarUrl
            });

        } catch (err) {
            console.error("Lỗi khi lấy thông tin tài khoản:", err);
        }
    }, []);

    useEffect(() => {
        fetchAccountInfo();
    }, [fetchAccountInfo]);

    return (
        <div 
            className="flex justify-between items-center bg-white px-6 py-4 border-b border-gray-200
            fixed top-0 left-64 right-0 z-10"
        >
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                    <img
                        src={profile.avatarUrl}
                        alt="avatar"
                        className="rounded-full w-10 h-10 ring-2 ring-indigo-400 p-0.5 object-cover"
                    />
                    <div className="leading-tight">
                        <p className="font-medium text-gray-800">{profile.email}</p>
                        <p className="text-sm text-gray-500">{profile.role}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
