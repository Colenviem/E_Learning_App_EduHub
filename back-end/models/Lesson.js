const mongoose = require("mongoose");

// Định nghĩa Schema cho chi tiết từng phần nhỏ của bài học (Lesson Details)
const lessonDetailSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        time: { type: String }, 
    },
    { _id: false }
);

const lessonSchema = new mongoose.Schema(
    {
        _id: { type: String, required: true },
        courseId: { 
            type: String, 
            required: true, 
            ref: 'courses' 
        },
        title: { type: String, required: true },
        content: { type: String },
        time: { type: String }, 
        image: { type: String },
        numberOfLessons: { type: Number }, 
        lesson_details: [lessonDetailSchema], // Mảng chứa các sub-document chi tiết bài học
        describe: { type: String },        
        createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

module.exports = mongoose.model("lessons", lessonSchema);