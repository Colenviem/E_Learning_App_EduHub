const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        _id: { type: String },
        title: { type: String, required: true },
        description: { type: String },
        thumbnailUrl: { type: String },
        categoryId: { type: String, required: true },
        lessons: [{ type: String }],
        status: { type: Boolean, default: true },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

module.exports = mongoose.model("courses", courseSchema);