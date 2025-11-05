import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiSearch } from 'react-icons/fi';

// Dữ liệu mẫu
const accountsDataInitial = [
    {
        _id: "ACC001",
        email: "a@gmail.com",
        role: "student",
        status: true,
        createdAt: "2024-12-31T23:59:59Z",
        refreshTokens: [
            { token: "xxx.yyy.zzz", expiresAt: "2024-12-31T23:59:59Z" }
        ]
    },
    {
        _id: "ACC002",
        email: "b@gmail.com",
        role: "teacher",
        status: false,
        createdAt: "2024-11-20T12:00:00Z",
        refreshTokens: []
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.05 } }
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

const getStatusClasses = (status) => {
    return status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });
};

const AccountsTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [accountsData, setAccountsData] = useState(accountsDataInitial);
    const [editingAccount, setEditingAccount] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredAccounts = accountsData.filter(acc =>
        acc._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        acc.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSave = () => {
        setAccountsData(accountsData.map(acc => acc._id === editingAccount._id ? editingAccount : acc));
        setIsModalOpen(false);
    };

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
                    <h2 className="text-2xl font-bold text-gray-800">Danh sách tài khoản</h2>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Tìm theo email hoặc ID..."
                            className="flex-1 text-sm border w-80 border-gray-300 rounded-lg py-2 px-3 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button className="bg-indigo-600 w-24 text-center cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
                            <FiSearch size={16} />
                            Tìm
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4">Mã tài khoản</th>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4 text-center">Role</th>
                                <th className="py-3 px-4 text-center">Trạng thái</th>
                                <th className="py-3 px-4">Ngày tạo</th>
                                <th className="py-3 px-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {filteredAccounts.map(acc => (
                                <motion.tr
                                    key={acc._id}
                                    variants={rowVariants}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{acc._id}</td>
                                    <td className="py-3 px-4 text-gray-800">{acc.email}</td>
                                    <td className="py-3 px-4 text-center">{acc.role}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(acc.status)}`}>
                                            {acc.status ? "Active" : "Inactive"}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(acc.createdAt)}</td>
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                                            onClick={() => { setEditingAccount(acc); setIsModalOpen(true); }}
                                        >
                                            <FiEdit className="w-4 h-4" />
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </table>
                </div>
            </div>

            {/* Modal Edit */}
            {isModalOpen && editingAccount && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Chỉnh sửa tài khoản</h3>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">Email</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingAccount.email}
                                onChange={(e) => setEditingAccount({...editingAccount, email: e.target.value})}
                            />

                            <label className="text-sm font-medium">Role</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingAccount.role}
                                onChange={(e) => setEditingAccount({...editingAccount, role: e.target.value})}
                            >
                                <option>student</option>
                                <option>teacher</option>
                                <option>admin</option>
                            </select>

                            <label className="text-sm font-medium">Trạng thái</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingAccount.status ? "Active" : "Inactive"}
                                onChange={(e) => setEditingAccount({...editingAccount, status: e.target.value === "Active"})}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                            </select>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                                onClick={handleSave}
                            >
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccountsTable;