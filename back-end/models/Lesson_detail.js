const mongoose = require("mongoose");

// --- 1. Subschema cho Option ---
const optionSchema = new mongoose.Schema(
    {
        option: { type: String, required: true },
        correct: { type: Boolean, required: true }
    },
    { _id: false }
);

// --- 2. Subschema cho Quiz ---
const quizSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true }, // Sử dụng ID do bạn cung cấp (ví dụ: QUIZ10101_01)
        type: {
            type: String,
            required: true,
            enum: ["single_choice", "multiple_choice", "true_false"]
        },
        question: { type: String, required: true },
        options: { type: [optionSchema], default: [] },
        createdAt: { type: Date, default: Date.now }
    },
    { _id: false }
);

// --- 3. Lesson Detail Schema Chính ---
const lessonDetailSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        lessonId: {
            type: String,
            required: true,
            ref: "lessons"
        },
        name: { type: String, required: true },
        videoTitle: { type: String },
        videoUrl: { type: String },
        time: { type: String, default: "0 phút" },
        tasks: { type: [String], default: [] },
        quizzes: { type: [quizSchema], default: [] }, // <--- ĐÃ THÊM TRƯỜNG NÀY
        createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

module.exports = mongoose.model("lesson_details", lessonDetailSchema);