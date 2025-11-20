import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { FiEdit, FiSearch, FiX, FiPlus } from 'react-icons/fi';
import * as LucideIcons from 'react-icons/lu';
import { apiClient, endpoints } from '../../src/api';
import Spinner from '../spinner/Spinner';

// Danh sách các Icon khả dụng cho danh mục
const ICON_LIST = [
    'LuCode', 'LuBookOpen', 'LuLayers', 'LuZap', 'LuRss', 'LuFeather',
    'LuGlobe', 'LuShield', 'LuUser', 'LuLayoutGrid', 'LuMegaphone'
];

const getIconComponent = (iconName) => {
    return LucideIcons[iconName] || FiSearch; 
};

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.05 } }
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });

const CategoriesTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    
    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryIcon, setNewCategoryIcon] = useState(ICON_LIST[0]);
    const [nameError, setNameError] = useState("");
    
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(endpoints.categories);
            setCategories(res.data);
        } catch (err) {
            console.error("Error loading categories:", err);
            window.alert("Lỗi khi load danh mục");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const filteredCategories = searchQuery.trim() === ""
        ? categories
        : categories.filter(cat =>
            cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cat._id.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const handleSave = async () => {
        if (!editingCategory.name.trim()) {
            window.alert("Tên danh mục không được để trống.");
            return;
        }

        try {
            setLoading(true);
            await apiClient.put(`${endpoints.categories}/${editingCategory._id}`, editingCategory);
            await fetchCategories();
            setIsModalOpen(false);
            window.alert("Cập nhật thành công!");
        } catch (err) {
            console.error("Error updating category:", err);
            window.alert(err.response?.data?.message || "Lỗi khi cập nhật danh mục.");
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!newCategoryName.trim()) {
            setNameError("Tên danh mục không được để trống.");
            return;
        }
        setNameError(""); 
        
        try {
            setLoading(true);
            const res = await apiClient.post(endpoints.categories, { name: newCategoryName.trim(), icon: newCategoryIcon });
            
            await fetchCategories();
            
            setNewCategoryName("");
            setNewCategoryIcon(ICON_LIST[0]);
            setIsModalOpenAdd(false);
            window.alert(`Thêm danh mục "${res.data.name}" thành công!`);

        } catch (err) {
            console.error("Lỗi khi thêm danh mục:", err.response?.data || err.message);
            window.alert(err.response?.data?.message || "Lỗi khi thêm danh mục.");
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
                    <h2 className="text-2xl font-bold text-gray-800">Danh sách danh mục</h2>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input
                            type="text"
                            placeholder="Tìm theo tên hoặc ID..."
                            className="flex-1 text-sm border w-80 border-gray-300 rounded-lg py-2 px-3 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button 
                            className="bg-indigo-600 text-center cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            onClick={() => {
                                setSearchQuery("");
                                fetchCategories();
                            }}
                        >
                            <FiSearch size={16} /> 
                            { searchQuery ? "Xóa" : "Tìm kiếm" }
                        </button>

                        
                        <button
                            className="bg-indigo-600 text-center cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                            onClick={() => {
                                setNewCategoryName("");
                                setNewCategoryIcon(ICON_LIST[0]);
                                setNameError("");
                                setIsModalOpenAdd(true);
                            }}
                        >
                            <FiPlus size={16} />
                            Thêm danh mục
                        </button>
                    </div>
                </div>

                
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
                            <tr>
                                <th className="py-3 px-4">Mã danh mục</th>
                                <th className="py-3 px-4">Icon</th>
                                <th className="py-3 px-4">Tên danh mục</th>
                                <th className="py-3 px-4">Ngày tạo</th>
                                <th className="py-3 px-4 text-center">Hành động</th>
                            </tr>
                        </thead>
                        <Motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {filteredCategories.map(cat => {
                                const IconComponent = getIconComponent(cat.icon);
                                return (
                                    <Motion.tr key={cat._id} variants={rowVariants} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">{cat._id}</td>
                                        <td className="py-3 px-4 text-center">
                                            
                                            {React.createElement(IconComponent, { size: 20, className: 'text-indigo-600 mx-auto' })}
                                        </td>
                                        <td className="py-3 px-4">{cat.name}</td>
                                        <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(cat.createdAt)}</td>
                                        <td className="py-3 px-4 text-center">
                                            <button
                                                className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                                                onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
                                            >
                                                <FiEdit className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </Motion.tr>
                                );
                            })}
                        </Motion.tbody>
                    </table>
                </div>
            </div>

            {/* --- Modal Edit Category --- */}
            {isModalOpen && editingCategory && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Chỉnh sửa danh mục</h3>
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">Tên danh mục</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={editingCategory.name}
                                onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
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

            {/* --- Modal Add Category --- */}
            {isModalOpenAdd && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Thêm Danh mục mới</h3>

                        <div className="flex flex-col gap-3">
                            {/* Input Tên Danh mục */}
                            <label className="text-sm font-medium">Tên danh mục</label>
                            <input
                                type="text"
                                className="border border-gray-300 rounded-lg p-2 text-sm"
                                value={newCategoryName}
                                onChange={(e) => {
                                    setNewCategoryName(e.target.value);
                                    setNameError(""); 
                                }}
                            />
                            <span className="text-red-500 text-xs">{nameError}</span>

                            {/* Chọn Icon */}
                            <label className="text-sm font-medium mt-2">Chọn Icon</label>
                            <div className="grid grid-cols-6 gap-3 p-3 border border-gray-200 rounded-lg max-h-40 overflow-y-auto">
                                {ICON_LIST.map(iconName => {
                                    const Icon = getIconComponent(iconName);
                                    const isSelected = newCategoryIcon === iconName;
                                    return (
                                        <button
                                            key={iconName}
                                            className={`p-2 rounded-lg transition-all border ${isSelected ? "bg-indigo-600 text-white border-indigo-700 shadow-md" : "bg-gray-100 text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 border-gray-300"}`}
                                            onClick={() => setNewCategoryIcon(iconName)}
                                            title={iconName}
                                        >
                                            <Icon size={24} className="mx-auto" />
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {/* Preview Icon đã chọn */}
                            <div className="mt-2 p-2 border border-dashed rounded-lg text-center">
                                <span className="text-sm text-gray-600 mr-2">Icon đã chọn: </span>
                                {React.createElement(getIconComponent(newCategoryIcon), { size: 24, className: 'inline text-indigo-600' })}
                                <b className="ml-2 text-indigo-700 text-sm">{newCategoryIcon}</b>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition cursor-pointer"
                                onClick={() => setIsModalOpenAdd(false)}
                            >
                                Hủy
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
                                onClick={handleAdd}
                            >
                                Thêm danh mục
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoriesTable;