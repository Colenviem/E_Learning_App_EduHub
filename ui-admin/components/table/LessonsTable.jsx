import React, { useState, useEffect, useCallback } from "react";
import { motion as Motion } from "framer-motion";
import { FiEdit, FiSearch, FiX } from "react-icons/fi";
import { apiClient, endpoints } from '../../src/api';
import Spinner from "../spinner/Spinner";

const IMAGE_DEFAULT = "https://i.pinimg.com/736x/57/89/d9/5789d95d55ce358b93a99bbab84e3df7.jpg";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { delayChildren: 0.2, staggerChildren: 0.05 },
    },
};
const rowVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });

// ---------------------------------- QUIZ ITEM ------------------------------------
const QuizItem = ({ quiz, onChange, onRemove }) => {
    const handleQuestionChange = (e) => onChange({ ...quiz, question: e.target.value });

    const handleOptionChange = (idx, value) => {
        const newOptions = [...quiz.options];
        newOptions[idx].option = value;
        onChange({ ...quiz, options: newOptions });
    };

    const handleCorrectChange = (idx) => {
        const newOptions = quiz.options.map((opt, i) => ({
            ...opt,
            correct: i === idx,
        }));
        onChange({ ...quiz, options: newOptions });
    };

    return (
        <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50/50 mb-3 shadow-sm hover:shadow-md transition-shadow relative">
            
            {/* Nút XÓA QUIZ */}
            {onRemove && (
                <button
                    type="button"
                    className="absolute top-2 right-2 text-red-500 hover:text-white p-1 rounded-full hover:bg-red-500 transition-colors z-10"
                    onClick={onRemove}
                    title="Xóa Quiz này"
                >
                    <FiX size={16} />
                </button>
            )}

            {/* Câu hỏi */}
            <input
                type="text"
                value={quiz.question}
                onChange={handleQuestionChange}
                className="w-full border-b-2 border-indigo-400 bg-transparent rounded-none p-2 mb-3 text-sm font-semibold placeholder-gray-500 focus:outline-none focus:border-indigo-600 transition-colors"
                placeholder="Nhập câu hỏi tại đây..."
            />

            {/* Các đáp án */}
            <div className='space-y-2'>
                {quiz.options?.map((opt, i) => (
                    <div key={i} className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${opt.correct ? "bg-green-100/70 border border-green-300" : "bg-gray-50 border border-gray-200"}`}>
                        
                        {/* Radio Button */}
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="radio"
                                checked={opt.correct}
                                onChange={() => handleCorrectChange(i)}
                                className="form-radio h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                        </label>

                        {/* Đáp án Input */}
                        <input
                            type="text"
                            value={opt.option}
                            onChange={(e) => handleOptionChange(i, e.target.value)}
                            className="flex-1 bg-transparent text-sm border-none focus:ring-0 p-0"
                            placeholder={`Đáp án ${i + 1}`}
                        />
                        
                        {/* Label Đúng */}
                        {opt.correct && <span className="text-xs font-bold text-green-700 px-2 py-0.5 rounded-full bg-green-200">ĐÚNG</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ---------------------------------- MAIN ------------------------------------
const LessonsTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [lessonsData, setLessonsData] = useState([]);
    const [editingLesson, setEditingLesson] = useState(null);
    const [editLessonDetails, setEditLessonDetails] = useState([]);
    const [coursesData, setCoursesData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // load lessons
    const fetchLessons = useCallback(async () => {
        setLoading(true);
        try {
            const res = await apiClient.get(endpoints.lessons);
            setLessonsData(res.data);
        } catch (err) {
            console.error("Không thể load lessons", err);
        }
        setLoading(false);
    }, []);

    const fetchCourses = useCallback(async () => {
        try {
            const res = await apiClient.get(endpoints.courses);
            setCoursesData(res.data);
        } catch (err) {
            console.error("Không thể load courses", err);
        }
    }, []);

    useEffect(() => {
        fetchLessons();
        fetchCourses();
    }, [fetchLessons, fetchCourses]);

    const filteredLessons = searchQuery.trim() === "" 
        ? lessonsData 
        : lessonsData.filter(lesson =>
            lesson._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenModal = async (lesson) => {
        setEditingLesson(lesson);
        try {
            const res = await apiClient.get(`${endpoints.lessonDetails}/${lesson._id}`);
            setEditLessonDetails(res.data);
        } catch (err) {
            console.error("Không thể load lesson details", err);
        }
        setIsModalOpen(true);
    };

    const handleRemoveTask = (detailIdx, taskIdx) => {
        const newDetails = [...editLessonDetails];
        newDetails[detailIdx].tasks.splice(taskIdx, 1);
        setEditLessonDetails(newDetails);
    };

    const handleRemoveQuiz = (detailIdx, quizId) => {
        const newDetails = [...editLessonDetails];
        const updatedQuizzes = newDetails[detailIdx].quizzes.filter(q => q._id !== quizId);
        newDetails[detailIdx].quizzes = updatedQuizzes;
        setEditLessonDetails(newDetails);
    };

    const handleSave = async () => {
        setLoading(true); // Thêm loading state để người dùng biết đang xử lý
        try {
            // Bước 1: Gửi request PUT
            // Backend nhận editingLesson (bao gồm courseId, title, content) và editLessonDetails
            const res = await apiClient.put(`${endpoints.lessonDetails}/${editingLesson._id}`, {
                ...editingLesson,
                lessonDetails: editLessonDetails,
            });

            // Bước 2: Trích xuất dữ liệu đã cập nhật từ phản hồi của server
            // Dựa trên code backend, server trả về { lesson, editLessonDetails }
            const { lesson: updatedLesson, editLessonDetails: updatedLessonDetails } = res.data;
            
            // ❗ Sửa lỗi: Đảm bảo có updatedLesson và nó có _id
            if (!updatedLesson || !updatedLesson._id) {
                throw new Error("Server response missing updated lesson data.");
            }

            // Bước 3: Cập nhật lessonsData trong state (Front-end)
            const updatedLessons = lessonsData.map(l =>
                l._id === updatedLesson._id ? updatedLesson : l
            );
            setLessonsData(updatedLessons);

            // Cập nhật editLessonDetails (cho state hiện tại, nếu cần)
            setEditLessonDetails(updatedLessonDetails);
            
            // Bước 4: Đóng modal và kết thúc
            setIsModalOpen(false);
            alert(`Lưu bài học "${updatedLesson.title}" thành công!`);

        } catch (err) {
            console.error("Lỗi khi lưu bài học:", err.response?.data || err.message);
            alert('Lỗi khi lưu bài học! Chi tiết xem console log.');
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
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
                    <h2 className="text-2xl font-bold text-gray-800">Danh sách bài học</h2>

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
                                setSearchQuery("");
                                fetchLessons();
                            }}    
                        >
                            <FiSearch size={16} /> 
                            { searchQuery ? "Xóa" : "Tìm" }
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-sm text-left border-collapse rounded-xl overflow-hidden shadow-lg border border-gray-100">
                        <thead className="bg-indigo-50/70 text-indigo-800 uppercase text-xs font-bold border-b border-indigo-200 sticky top-0">
                            <tr>
                                <th className="py-3 px-4 whitespace-nowrap">Mã bài học</th>
                                <th className="py-3 px-4">Tiêu đề</th>
                                <th className="py-3 px-4 text-center">Thời gian</th>
                                <th className="py-3 px-4 text-center whitespace-nowrap">Số lượng bài học</th>
                                <th className="py-3 px-4 whitespace-nowrap">Ngày tạo</th>
                                <th className="py-3 px-4 text-center w-20">Hành động</th>
                            </tr>
                        </thead>

                        <Motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {filteredLessons.map((lesson) => (
                                <Motion.tr
                                    key={lesson._id}
                                    variants={rowVariants}
                                    className="border-b border-gray-100 last:border-b-0 hover:bg-indigo-50 transition-colors duration-200"
                                >
                                    {/* Mã bài học */}
                                    <td className="py-3 px-4 text-gray-700 font-medium tracking-wider">{lesson._id}</td>
                                    
                                    {/* Tiêu đề & Ảnh */}
                                    <td className="py-3 px-4">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={lesson.image || IMAGE_DEFAULT}
                                                alt={lesson.title}
                                                className="w-10 h-10 object-cover rounded-md shadow-sm border border-gray-200"
                                            />
                                            <span className="font-semibold text-gray-900 truncate max-w-xs">{lesson.title}</span>
                                        </div>
                                    </td>

                                    {/* Thời gian */}
                                    <td className="py-3 px-4 text-center text-gray-700 font-medium">{lesson.time}</td>
                                    
                                    {/* Số lượng bài học */}
                                    <td className="py-3 px-4 text-center text-gray-600">
                                        <span className="bg-gray-200/50 px-3 py-1 rounded-full text-xs font-medium">
                                            {lesson.numberOfLessons}
                                        </span>
                                    </td>

                                    {/* Ngày tạo */}
                                    <td className="py-3 px-4 text-gray-500 whitespace-nowrap">
                                        {formatDate(lesson.createdAt)}
                                    </td>

                                    {/* Hành động */}
                                    <td className="py-3 px-4 text-center">
                                        <button
                                            className="p-2 text-indigo-600 hover:text-white rounded-full hover:bg-indigo-600 transition-colors duration-200 cursor-pointer"
                                            onClick={() => {
                                                handleOpenModal(lesson);
                                            }}
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

            {/* Modal Edit */}
            {isModalOpen && editingLesson && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-start justify-center z-50 overflow-y-auto py-10">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl p-8 relative transform transition-all duration-300">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3 text-center">
                            Chỉnh sửa Bài học: {editingLesson.title}
                        </h3>

                        {/* MAIN GRID: Lesson Details (Left) and Quizzes/Tasks (Right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* 1. LEFT COLUMN: Main Lesson Content (Giữ nguyên) */}
                            <div className="flex flex-col gap-4">
                                <h4 className="text-lg font-semibold text-indigo-700">Thông tin cơ bản</h4>

                                <label className="text-sm font-semibold text-gray-700">Khóa học</label>
                                <select
                                    className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                    value={editingLesson.courseId}
                                    onChange={(e) =>
                                        setEditingLesson({ ...editingLesson, courseId: e.target.value })
                                    }
                                >
                                    <option value="">-- Chọn khóa học --</option>
                                    {coursesData.map((course) => (
                                        <option key={course._id} value={course._id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>

                                {/* Tiêu đề */}
                                <label className="text-sm font-semibold text-gray-700">Tiêu đề</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-xl p-3 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                    value={editingLesson.title}
                                    onChange={(e) =>
                                        setEditingLesson({ ...editingLesson, title: e.target.value })
                                    }
                                />

                                {/* Nội dung */}
                                <label className="text-sm font-semibold text-gray-700">Nội dung</label>
                                <textarea
                                    className="border border-gray-300 rounded-xl p-3 text-sm min-h-[150px] resize-y focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                                    value={editingLesson.content}
                                    onChange={(e) =>
                                        setEditingLesson({ ...editingLesson, content: e.target.value })
                                    }
                                />
                            </div>

                            {/* 2. RIGHT COLUMN: Tasks and Quizzes (Scrollable Area) */}
                            <div className="flex flex-col gap-4">
                                <h4 className="text-lg font-semibold text-green-700 border-b pb-2">Nội dung chi tiết & Bài tập</h4>
                                
                                {/* Scrollable Container */}
                                <div className="bg-gray-50 p-4 rounded-xl max-h-[60vh] overflow-y-auto space-y-6">
                                    {/* Duyệt qua các Lesson Details (mỗi detail là một phần nội dung/quiz) */}
                                    {editLessonDetails && editLessonDetails.map((detail, idx) => (
                                        <div key={idx} className="p-5 border border-gray-200 rounded-xl bg-white shadow-md">

                                            <h5 className="font-extrabold text-base text-gray-900 mb-4 border-b pb-2 flex justify-between items-center">
                                                <span>Chi Tiết Nội Dung #{idx + 1}</span>
                                                {/* Thêm nút xóa chi tiết ở đây nếu cần */}
                                            </h5>

                                            <label className="text-sm font-semibold text-gray-700">Tên phần nội dung</label>
                                            <input
                                                type="text"
                                                className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 mb-4"
                                                value={detail.name}
                                                onChange={(e) => {
                                                    const newDetails = [...editLessonDetails];
                                                    newDetails[idx].name = e.target.value;
                                                    setEditLessonDetails(newDetails);
                                                }}
                                            />

                                            {/* 📹 Video Preview & URL Input */}
                                            <div className="mb-4">
                                                <label className="text-sm font-semibold text-gray-700 mb-2 block">Video URL</label>
                                                <input
                                                    type="text"
                                                    value={detail.videoUrl || ''}
                                                    placeholder="Link video MP4/URL..."
                                                    className="w-full border border-gray-300 rounded-xl p-2.5 text-sm focus:border-indigo-500 transition duration-150 mb-2"
                                                    onChange={(e) => {
                                                        const newDetails = [...editLessonDetails];
                                                        newDetails[idx].videoUrl = e.target.value;
                                                        newDetails[idx].videoTitle = e.target.value.split('/').pop(); // Lấy tên file từ URL
                                                        setEditLessonDetails(newDetails);
                                                    }}
                                                />
                                                {detail.videoUrl && (
                                                    <video
                                                        src={detail.videoUrl}
                                                        controls
                                                        className="w-full rounded-lg shadow-sm"
                                                    />
                                                )}
                                            </div>
                                            
                                            {/* 📝 Task List */}
                                            <label className="text-sm font-semibold text-gray-700 mt-4 pt-3 border-t block">Mục tiêu bài học (Tasks)</label>
                                            <div className="space-y-2 mt-2">
                                                {detail.tasks && detail.tasks.map((task, tIdx) => (
                                                    <div key={tIdx} className="flex items-center gap-2">
                                                        <span className="text-indigo-500 text-lg">▪</span>
                                                        <input
                                                            type="text"
                                                            className="border border-gray-200 rounded-lg p-2 text-sm flex-1 focus:border-indigo-500"
                                                            value={task}
                                                            onChange={(e) => {
                                                                const newDetails = [...editLessonDetails];
                                                                newDetails[idx].tasks[tIdx] = e.target.value;
                                                                setEditLessonDetails(newDetails);
                                                            }}
                                                        />
                                                        <button
                                                            type="button"
                                                            className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                            onClick={() => handleRemoveTask(idx, tIdx)}
                                                        >
                                                            <FiX size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                                {/* Nút thêm Task mới */}
                                            </div>

                                            {/* ❓ Quiz Items */}
                                            <label className="text-sm font-semibold text-gray-700 mt-6 pt-4 border-t block">Bài kiểm tra (Quizzes)</label>
                                            {detail.quizzes && detail.quizzes.map((quiz, qIdx) => (
                                                <QuizItem
                                                    key={quiz._id || qIdx} // Sử dụng _id nếu có, nếu không dùng qIdx
                                                    quiz={quiz}
                                                    // Truyền hàm xóa quiz xuống component QuizItem
                                                    onRemove={() => handleRemoveQuiz(idx, quiz._id)} 
                                                    onChange={(updatedQuiz) => {
                                                        const newQuizzes = [...detail.quizzes];
                                                        newQuizzes[qIdx] = updatedQuiz;
                                                        const newDetails = [...editLessonDetails];
                                                        newDetails[idx].quizzes = newQuizzes;
                                                        setEditLessonDetails(newDetails);
                                                    }}
                                                />
                                            ))}
                                            
                                            {/* Nút thêm Quiz (Đã tối ưu CSS) */}
                                            <button
                                                className="mt-4 px-4 py-2 text-sm bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm font-medium flex items-center gap-2"
                                                onClick={() => {
                                                    const newDetails = [...editLessonDetails];
                                                    newDetails[idx].quizzes.push({
                                                        _id: `QUIZ_${Date.now()}`,
                                                        question: "Câu hỏi mới",
                                                        options: [
                                                            { option: "Đáp án A", correct: false },
                                                            { option: "Đáp án B", correct: false },
                                                            { option: "Đáp án C", correct: false },
                                                            { option: "Đáp án D", correct: true }, // Mặc định 1 đáp án đúng
                                                        ],
                                                    });
                                                    setEditLessonDetails(newDetails);
                                                }}
                                            >
                                                + Thêm Quiz mới
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons (Giữ nguyên phong cách tối ưu) */}
                        <div className="mt-8 pt-4 border-t flex justify-end gap-3">
                            <button
                                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition-colors duration-150"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Hủy
                            </button>

                            <button
                                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-150 shadow-md shadow-indigo-200/50"
                                onClick={handleSave}
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LessonsTable;