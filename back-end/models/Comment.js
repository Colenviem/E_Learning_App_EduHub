const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        _id: { type: String },
        lessonId: { type: String, required: true },
        userId: { type: String, required: true },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

module.exports = mongoose.model("comments", commentSchema);