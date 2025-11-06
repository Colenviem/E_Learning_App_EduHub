const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
    {
        _id: { type: String },
        courseId: { type: String, required: true },
        title: { type: String, required: true },
        content: { type: String },
        videoUrl: { type: String },
        quizIds: [{ type: String }],
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

module.exports = mongoose.model("lessons", lessonSchema);