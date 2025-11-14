const mongoose = require("mongoose");

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
        createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

module.exports = mongoose.model("lesson_details", lessonDetailSchema);