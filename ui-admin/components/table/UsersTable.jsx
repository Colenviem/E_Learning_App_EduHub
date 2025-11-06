import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiEdit } from 'react-icons/fi';
import axios from 'axios';
import Spinner from '../spinner/Spinner';

const API = "http://localhost:5000/users";
const IMAGE_DEFAULT = "https://i.pinimg.com/736x/57/89/d9/5789d95d55ce358b93a99bbab84e3df7.jpg";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.05 } },
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const UsersTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [usersData, setUsersData] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUsers = useCallback(async () => {
        try {
            setLoading(true);
            const res = await axios.get(API);
            setUsersData(res.data);
        } catch (err) {
            console.error("Lỗi khi fetch users:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const filteredUsers = usersData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setEditingUser({ ...editingUser, avatarUrl: ev.target.result });
            }
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await axios.put(`${API}/${editingUser._id}`, editingUser);
            fetchUsers(); 
            setIsModalOpen(false);
        } catch (err) {
            console.error("Lỗi khi update user:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Spinner size={12}/>;
    }

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
                    <h2 className="text-2xl font-bold text-gray-800">Danh sách người dùng</h2>

                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Tìm theo tên, ID..."
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

                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4">Người dùng</th>
                                <th className="py-3 px-4">Mã người dùng</th>
                                <th className="py-3 px-4">Ngày tham gia</th>
                                <th className="py-3 px-4 text-center">Hành động</th>
                            </tr>
                        </thead>

                        <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {filteredUsers.map((user) => (
                                <motion.tr
                                    key={user._id}
                                    variants={rowVariants}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4 flex items-center gap-3 font-medium text-gray-800">
                                        <img
                                            src={user.avatarUrl || IMAGE_DEFAULT}
                                            alt={user.name}
                                            className="w-9 h-9 object-cover rounded-full"
                                        />
                                        <span className="truncate max-w-xs">{user.name}</span>
                                    </td>

                                    <td className="py-3 px-4 text-gray-800">{user._id}</td>
                                    <td className="py-3 px-4 text-gray-800">{formatDate(user.createdAt)}</td>

                                    <td className="py-3 px-4 text-center">
                                        <button
                                            title="Sửa thông tin"
                                            className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                                            onClick={() => { setEditingUser(user); setIsModalOpen(true); }}
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

            {isModalOpen && editingUser && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Chỉnh sửa người dùng</h3>

                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-4">
                                <img src={editingUser.avatarUrl} alt="Avatar" className="w-16 h-16 object-cover rounded-full border border-gray-100" />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                            </div>

                            <label className="text-sm font-medium">Tên</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                            />
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

export default UsersTable;