import React from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
    FiHome, FiUser, FiClipboard, FiBookOpen, FiBarChart2,
    FiList, FiTag, FiDollarSign, FiSettings, FiLogOut
} from 'react-icons/fi';

const menuStructure = [
    {
        group: null,
        items: [
            { label: "Dashboard", icon: <FiHome />, path: "/admin/dashboard" },
            { label: "Người dùng", icon: <FiUser />, path: "/admin/users" },
            { label: "Tài khoản", icon: <FiClipboard />, path: "/admin/accounts" },
            { label: "Khóa học", icon: <FiBookOpen />, path: "/admin/courses" }, 
            { label: "Bài học", icon: <FiList />, path: "/admin/lessons" }, 
            { label: "Thể loại", icon: <FiTag />, path: "/admin/categories" },
            { label: "Hóa đơn", icon: <FiDollarSign />, path: "/admin/orders" }, 
        ],
    },
];

const setting = {
    items: [
        { label: "Cài đặt", icon: <FiSettings />, path: "/admin/setting" },
        { label: "Đăng xuất", icon: <FiLogOut />, path: "/login", logout: true },
    ]
}

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
};

const SidebarItem = ({ item, onLogout }) => {
    if (item.logout) {
        return (
            <motion.div variants={itemVariants}>
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 p-3 rounded-lg text-sm text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition-all"
                >
                    {item.icon}
                    {item.label}
                </button>
            </motion.div>
        );
    }

    return (
        <motion.div variants={itemVariants}>
            <NavLink
                to={item.path}
                className={({ isActive }) =>
                    `flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-200
                    ${isActive
                        ? "bg-indigo-600 text-white font-semibold shadow-md"
                        : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 font-medium"
                    }`
                }
            >
                {item.icon}
                {item.label}
            </NavLink>
        </motion.div>
    );
};

const DashboardSidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Xóa dữ liệu đăng nhập
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('userRole'); // nếu có lưu role
        navigate('/login', { replace: true });
    }

    return (
        <motion.aside
            className="w-64 bg-white flex flex-col border-r border-gray-200 shadow-sm max-h-screen sticky top-0"
            initial={{ x: -64 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <div className="px-6 py-5 text-2xl font-semibold text-indigo-700 flex items-center gap-2 border-b border-gray-200">
                <FiBarChart2 /> DashStack
            </div>

            <nav className="flex-1 px-4 py-4 overflow-y-auto">
                {menuStructure.map((group, idx) => (
                    <div key={idx} className="space-y-1 mb-4">
                        {group.group && (
                            <h4 className="text-xs uppercase text-gray-400 font-bold px-3 pt-4 pb-1 tracking-wider">
                                {group.group}
                            </h4>
                        )}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                        >
                            {group.items.map(item => (
                                <SidebarItem key={item.label} item={item} />
                            ))}
                        </motion.div>
                    </div>
                ))}
            </nav>

            <div className="mt-auto p-4 border-t border-gray-200 space-y-1">
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                >
                    {setting.items.map(item => (
                        <SidebarItem key={item.label} item={item} onLogout={handleLogout} />
                    ))}
                </motion.div>
            </div>
        </motion.aside>
    );
};

export default DashboardSidebar;