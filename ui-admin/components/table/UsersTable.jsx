import React, { useState } from 'react'; 
import { motion } from 'framer-motion';
import { FiSearch, FiEdit } from 'react-icons/fi';

const usersDataInitial = [
    { _id: "USER001", accountId: "ACC001", name: "Nguyen Van A", avatarUrl: "https://i.ibb.co/L5B7n2t/apple-watch.png", createdAt: "2024-12-31T23:59:59Z", status: "Active" },
    { _id: "USER002", accountId: "ACC002", name: "Tran Thi B", avatarUrl: "https://i.ibb.co/3Wf4Q7W/airpods.png", createdAt: "2024-11-15T10:30:00Z", status: "Active" },
    { _id: "USER003", accountId: "ACC003", name: "Le Van C", avatarUrl: "https://i.ibb.co/74S2K9g/macbook.png", createdAt: "2024-10-05T08:00:00Z", status: "Banned" },
    { _id: "USER004", accountId: "ACC004", name: "Pham Duc D", avatarUrl: "https://i.ibb.co/b3gQ8k7/ipad.png", createdAt: "2024-09-20T14:22:00Z", status: "Inactive" },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.05 } },
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
};

const getStatusClasses = (status) => {
    switch (status) {
        case "Active": return "bg-green-100 text-green-700";
        case "Inactive": return "bg-gray-100 text-gray-600";
        case "Banned": return "bg-red-100 text-red-700";
        default: return "bg-yellow-100 text-yellow-700";
    }
};

const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
};

const UsersTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [usersData, setUsersData] = useState(usersDataInitial);
    const [editingUser, setEditingUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredUsers = usersData.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.accountId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setEditingUser({...editingUser, avatarUrl: ev.target.result});
            }
            reader.readAsDataURL(file);
        }
    }

    const handleSave = () => {
        setUsersData(usersData.map(u => u._id === editingUser._id ? editingUser : u));
        setIsModalOpen(false);
    }

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
            <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Danh sách người dùng
                    </h2>
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
                                <th className="py-3 px-4 text-center">Trạng thái</th>
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
                                            src={user.avatarUrl}
                                            alt={user.name}
                                            className="w-9 h-9 object-cover rounded-full"
                                        />
                                        <span className="truncate max-w-xs">{user.name}</span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-600 font-mono text-xs">{user._id}</td>
                                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(user.createdAt)}</td>
                                    <td className="py-3 px-4 text-center">
                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getStatusClasses(user.status)}`}>
                                            {user.status}
                                        </span>
                                    </td>
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
                                <img src={editingUser.avatarUrl} alt="Avatar" className="w-16 h-16 object-cover rounded-full border" />
                                <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm" />
                            </div>

                            <label className="text-sm font-medium">Tên</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingUser.name}
                                onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                            />

                            <label className="text-sm font-medium">Trạng thái</label>
                            <select
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingUser.status}
                                onChange={(e) => setEditingUser({...editingUser, status: e.target.value})}
                            >
                                <option>Active</option>
                                <option>Inactive</option>
                                <option>Banned</option>
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
}

export default UsersTable;