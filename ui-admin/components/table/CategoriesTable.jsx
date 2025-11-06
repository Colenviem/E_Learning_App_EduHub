import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import Spinner from '../spinner/Spinner';

const API = "http://localhost:5000/categories";

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
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setCategories(res.data);
    } catch (err) {
      console.error("Error loading categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = categories.filter(cat =>
    cat._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.put(`${API}/${editingCategory._id}`, editingCategory);
      await fetchCategories();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error updating category:", err);
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
        {/* Header & Search */}
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
            <button className="bg-indigo-600 w-24 text-center cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2">
              <FiSearch size={16} /> Tìm
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-sm text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Mã danh mục</th>
                <th className="py-3 px-4">Tên danh mục</th>
                <th className="py-3 px-4">Mô tả</th>
                <th className="py-3 px-4">Ngày tạo</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
              {filteredCategories.map(cat => (
                <motion.tr key={cat._id} variants={rowVariants} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4">{cat._id}</td>
                  <td className="py-3 px-4">{cat.name}</td>
                  <td className="py-3 px-4">{cat.description}</td>
                  <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{formatDate(cat.createdAt)}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                      onClick={() => { setEditingCategory(cat); setIsModalOpen(true); }}
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
              <label className="text-sm font-medium">Mô tả</label>
              <textarea
                className="border border-gray-300 rounded-lg p-2 text-sm"
                value={editingCategory.description}
                onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
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

export default CategoriesTable;