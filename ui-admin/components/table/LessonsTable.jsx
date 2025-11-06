import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiEdit, FiSearch } from "react-icons/fi";
import axios from "axios";
import Spinner from "../spinner/Spinner";

const LESSON_API = "http://localhost:5000/lessons";
const QUIZZ_API = "http://localhost:5000/quizzes";

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
const QuizItem = ({ quiz, onChange }) => {
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
        <div className="border border-gray-300 rounded-lg p-4 bg-white mb-4">
            <input
                type="text"
                value={quiz.question}
                onChange={handleQuestionChange}
                className="w-full border border-gray-300 rounded-lg p-2 mb-3 text-sm"
                placeholder="Câu hỏi"
            />

            {quiz.options?.map((opt, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                    <input
                        type="text"
                        value={opt.option}
                        onChange={(e) => handleOptionChange(i, e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                        placeholder={`Option ${i + 1}`}
                    />

                    <label className="flex items-center gap-1 text-xs">
                        <input
                            type="radio"
                            checked={opt.correct}
                            onChange={() => handleCorrectChange(i)}
                        />
                        Đúng
                    </label>
                </div>
            ))}
        </div>
    );
};

// ---------------------------------- MAIN ------------------------------------
const LessonsTable = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [lessonsData, setLessonsData] = useState([]);
    const [editingLesson, setEditingLesson] = useState(null);
    const [lessonQuizz, setLessonQuizz] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    // load lessons
    const fetchLessons = async () => {
        setLoading(true);
        try {
            const res = await axios.get(LESSON_API);
            setLessonsData(res.data);
        } catch (err) {
            console.error("Không thể load lessons", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    // Load quiz khi chọn lesson
    useEffect(() => {
        const fetchLessonQuiz = async () => {
            if (!editingLesson) return;

            try {
                const res = await axios.get(`${QUIZZ_API}?lessonId=${editingLesson._id}`);
                setLessonQuizz(res.data);
            } catch (err) {
                console.error("Cannot load quiz:", err);
            }
        };

        fetchLessonQuiz();
    }, [editingLesson]);

    const filteredLessons = lessonsData.filter(
        (l) =>
            l._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            l.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // SAVE updates
    const handleSave = async () => {
        if (!editingLesson) return;

        try {
            // update lesson
            await axios.put(`${LESSON_API}/${editingLesson._id}`, editingLesson);

            // update each quiz
            await Promise.all(
                lessonQuizz.map((q) =>
                    axios.put(`${QUIZZ_API}/${q._id}`, q)
                )
            );

            fetchLessons();
            setIsModalOpen(false);
        } catch (err) {
            console.error("Lỗi khi lưu:", err);
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
                                <th className="py-3 px-4">Mã bài học</th>
                                <th className="py-3 px-4">Khóa học</th>
                                <th className="py-3 px-4">Tiêu đề</th>
                                <th className="py-3 px-4">Video</th>
                                <th className="py-3 px-4 text-center">Số câu hỏi</th>
                                <th className="py-3 px-4">Ngày tạo</th>
                                <th className="py-3 px-4 text-center">Hành động</th>
                            </tr>
                        </thead>

                        <motion.tbody variants={containerVariants} initial="hidden" animate="visible">
                            {filteredLessons.map((lesson) => (
                                <motion.tr
                                    key={lesson._id}
                                    variants={rowVariants}
                                    className="border-t border-gray-100 hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-3 px-4">{lesson._id}</td>
                                    <td className="py-3 px-4">{lesson.courseId}</td>
                                    <td className="py-3 px-4">{lesson.title}</td>

                                    <td className="py-3 px-4">
                                        {lesson.videoUrl ? (
                                            <a
                                                href={lesson.videoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-indigo-600 underline"
                                            >
                                                Xem video
                                            </a>
                                        ) : (
                                            "-"
                                        )}
                                    </td>

                                    <td className="py-3 px-4 text-center">{lesson.quizIds.length}</td>

                                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">
                                        {formatDate(lesson.createdAt)}
                                    </td>

                                    <td className="py-3 px-4 text-center">
                                        <button
                                            className="p-2 text-indigo-600 hover:text-indigo-800 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer"
                                            onClick={() => {
                                                setEditingLesson(lesson);
                                                setIsModalOpen(true);
                                            }}
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
            {isModalOpen && editingLesson && (
                <div className="fixed inset-0 bg-black/50 flex items-start justify-center z-50 overflow-y-auto py-10">
                    <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 relative">
                        <h3 className="text-xl font-semibold mb-4 text-center">Chỉnh sửa bài học</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* LEFT */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-medium">Tiêu đề</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-lg p-2 text-sm"
                                    value={editingLesson.title}
                                    onChange={(e) =>
                                        setEditingLesson({ ...editingLesson, title: e.target.value })
                                    }
                                />

                                <label className="text-sm font-medium">Nội dung</label>
                                <textarea
                                    className="border border-gray-300 rounded-lg p-2 text-sm h-40 resize-none"
                                    value={editingLesson.content}
                                    onChange={(e) =>
                                        setEditingLesson({ ...editingLesson, content: e.target.value })
                                    }
                                />

                                <label className="text-sm font-medium">Video URL</label>
                                <input
                                    type="text"
                                    className="border border-gray-300 rounded-lg p-2 text-sm"
                                    value={editingLesson.videoUrl}
                                    onChange={(e) =>
                                        setEditingLesson({
                                            ...editingLesson,
                                            videoUrl: e.target.value,
                                        })
                                    }
                                />

                                {editingLesson.videoUrl && (
                                    <video
                                        src={editingLesson.videoUrl}
                                        controls
                                        className="w-full h-60 rounded-lg border mt-2"
                                    />
                                )}
                            </div>

                            {/* RIGHT QUIZ */}
                            <div className="overflow-y-auto max-h-[80vh] pr-2">
                                <h4 className="text-sm font-medium mb-3">Câu hỏi bài quiz</h4>

                                {lessonQuizz.map((quizItem, idx) => (
                                    <QuizItem
                                        key={quizItem._id}
                                        quiz={quizItem}
                                        onChange={(updatedQuiz) => {
                                            const newArr = [...lessonQuizz];
                                            newArr[idx] = updatedQuiz;
                                            setLessonQuizz(newArr);
                                        }}
                                    />
                                ))}
                            </div>
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

export default LessonsTable;