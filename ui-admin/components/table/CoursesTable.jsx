import React, { useState, useEffect, useCallback } from 'react';
import { motion as Motion } from 'framer-motion';
import { FiEdit, FiSearch } from 'react-icons/fi';
import { apiClient, endpoints } from '../../src/api';
import Spinner from '../spinner/Spinner';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { delayChildren: 0.2, staggerChildren: 0.05 } }
};

const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

const getStatusClasses = (status) => status ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

const IMAGE_DEFAULT = "https://i.pinimg.com/736x/57/89/d9/5789d95d55ce358b93a99bbab84e3df7.jpg";

const formatDate = (dateString) => new Date(dateString).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short', day: 'numeric' });

const CoursesTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [coursesData, setCoursesData] = useState([]);
    const [categoriesData, setCategoriesData] = useState([]);
    const [editingCourse, setEditingCourse] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(endpoints.categories);
            setCategoriesData(res.data);
        } catch (err) {
            console.error("Lỗi khi fetch categories:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCourses = useCallback(async () => {
        try {
            setLoading(true);
            const res = await apiClient.get(endpoints.courses);
            setCoursesData(res.data);
        } catch (err) {
            console.error("Lỗi khi fetch users:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCourses();
        fetchCategories();
    }, [fetchCourses, fetchCategories]);

    const filteredCourses = searchQuery == ""
        ? coursesData
        : coursesData.filter(course =>
            course._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const formatCurrency = (amount) => {
        const numericAmount = Number(amount); 
        if (isNaN(numericAmount)) return 'N/A';
        
        return new Intl.NumberFormat('vi-VN', { 
            style: 'currency', 
            currency: 'VND',
            minimumFractionDigits: 0
        }).format(numericAmount);
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await apiClient.put(`${endpoints.courses}/${editingCourse._id}`, editingCourse);
            fetchCourses(); 
            setIsModalOpen(false);
        } catch (err) {
            console.error("Lỗi khi update account:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setEditingCourse({...editingCourse, thumbnailUrl: ev.target.result});
            reader.readAsDataURL(file);
        }
    }

    if (loading) {
        return <Spinner size={12}/>;
    }

    return (
        <div className="p-6 pt-24 bg-gray-50 min-h-screen">
        <div className="bg-white p-6 border border-gray-100 rounded-2xl shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
            <h2 className="text-2xl font-bold text-gray-800">Danh sách khóa học</h2>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <input
                type="text"
                placeholder="Tìm theo tên hoặc ID..."
                className="flex-1 text-sm border w-80 border-gray-300 rounded-lg py-2 px-3 bg-white focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                    className="bg-indigo-600 w-24 text-center cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-2"
                    onClick={() => {
                        setSearchQuery("")
                        fetchCourses(); // ← LOAD LẠI FULL LIST
                    }}    
                >
                    <FiSearch size={16} />
                    {searchQuery ? "Xóa" : "Tìm"}
                </button>
            </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm text-left border-collapse rounded-xl overflow-hidden shadow-sm">
                    <thead className="bg-gray-100 text-gray-600 uppercase text-xs font-semibold border-b border-gray-200">
                        <tr>
                            <th className="py-3 px-4 w-32">Mã khóa học</th>
                            <th className="py-3 px-4">Tiêu đề</th>
                            <th className="py-3 px-4 text-center">Người tham gia</th>
                            <th className="py-3 px-4 text-center">Số bài học</th>
                            <th className="py-3 px-4 text-center">Thời gian</th>
                            <th className="py-3 px-4 text-center">Trạng thái</th>
                            <th className="py-3 px-4 text-center">Giá tiền</th>
                            <th className="py-3 px-4 whitespace-nowrap">Ngày tạo</th>
                            <th className="py-3 px-4 text-center w-20">Hành động</th>
                        </tr>
                    </thead>

                    <Motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                        {filteredCourses.map(course => (
                            <Motion.tr 
                                key={course._id} 
                                variants={rowVariants}
                                className="border-b border-gray-100 hover:bg-indigo-50/40 transition-colors duration-200"
                            >
                                <td className="py-3 px-4 text-gray-800 font-medium">{course._id}</td>

                                
                                <td className="py-3 px-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={course.image || IMAGE_DEFAULT}
                                            alt={course.title}
                                            className="w-12 h-12 object-cover rounded-lg shadow-sm border border-gray-200"
                                        />
                                        <span className="font-semibold text-gray-800">{course.title}</span>
                                    </div>
                                </td>

                                <td className="py-3 px-4 text-center text-gray-700">{course.numberOfParticipants}</td>
                                <td className="py-3 px-4 text-center text-gray-700">{course.numberOfLessons}</td>
                                <td className="py-3 px-4 text-center text-gray-700">{course.time}</td>

                                <td className="py-3 px-4 text-center">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusClasses(course.status)}`}>
                                        {course.status ? "Active" : "Inactive"}
                                    </span>
                                </td>

                                <td className="py-3 px-4 text-center text-gray-700">
                                    
                                    {course.discount > 0 ? (
                                        <div className="flex flex-col items-center">
                                            
                                            <span className="font-bold text-sm text-indigo-600 whitespace-nowrap">
                                                {formatCurrency(course.price * (1 - course.discount / 100))}
                                            </span>
                                            
                                            <span className="text-xs text-gray-400 line-through">
                                                {formatCurrency(course.price)}
                                            </span>
                                            
                                            <span className="mt-1 px-1.5 py-0 rounded-md text-[10px] font-bold bg-red-100 text-red-600 tracking-tight">
                                                GIẢM {course.discount}%
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="font-medium text-gray-800 whitespace-nowrap">
                                            {formatCurrency(course.price)}
                                        </span>
                                    )}
                                </td>

                                <td className="py-3 px-4 text-gray-600">{formatDate(course.createdAt)}</td>

                                <td className="py-3 px-4 text-center">
                                    <button
                                        className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors"
                                        onClick={() => { setEditingCourse(course); setIsModalOpen(true); }}
                                    >
                                        <FiEdit className="w-4 h-4" />
                                    </button>
                                </td>
                            </Motion.tr>
                        ))}
                    </Motion.tbody>
                </table>
            </div>
        </div>

        
        {isModalOpen && editingCourse && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
                <h3 className="text-xl font-semibold mb-4 text-center">Chỉnh sửa khóa học</h3>
                <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4">
                    <img
                        src={editingCourse.image || IMAGE_DEFAULT}
                        alt="Thumbnail"
                        className="w-16 h-16 object-cover rounded-full border border-gray-50"
                    />
                    <input type="file" accept="image/*" onChange={handleThumbnailChange} className="text-sm"/>
                </div>

                <label className="text-sm font-medium">Tiêu đề</label>
                <input
                    type="text"
                    className="border border-gray-300 rounded-lg p-2 text-sm"
                    value={editingCourse.title}
                    onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                />

                <label className="text-sm font-medium">Danh mục</label>
                <select
                    className="border border-gray-300 rounded-lg p-2 text-sm"
                    value={editingCourse.categoryId || ""}
                    onChange={(e) => setEditingCourse({...editingCourse, categoryId: e.target.value})}
                >
                    <option value="">Chọn danh mục</option>
                    {categoriesData.map(category => (
                        <option key={category._id} value={category._id}>{category.name}</option>
                    ))}
                </select>
                
                <label className="text-sm font-medium">Mô tả</label>
                <textarea
                    className="border border-gray-300 rounded-lg p-2 text-sm"
                    value={editingCourse.description}
                    onChange={(e) => setEditingCourse({...editingCourse, description: e.target.value})}
                />

                <label className="text-sm font-medium">Trạng thái</label>
                <select
                    className="border border-gray-300 rounded-lg p-2 text-sm"
                    value={editingCourse.status ? "Active" : "Inactive"}
                    onChange={(e) => setEditingCourse({...editingCourse, status: e.target.value === "Active"})}
                >
                    <option>Active</option>
                    <option>Inactive</option>
                </select>
                </div>

                <label className="text-sm font-medium">Giá tiền</label>
                <input
                    type="number"
                    className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                    value={editingCourse.price}
                    onChange={(e) => setEditingCourse({...editingCourse, price: e.target.value})}
                />

                <label className="text-sm font-medium">Giảm giá</label>
                <input
                    type="number"
                    className="border border-gray-300 rounded-lg p-2 text-sm w-full"
                    value={editingCourse.discount}
                    onChange={(e) => setEditingCourse({...editingCourse, discount: e.target.value})}
                />

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

export default CoursesTable;