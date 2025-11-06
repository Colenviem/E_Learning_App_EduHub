const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
    {
        _id: { type: String },
        userId: { type: String, required: true },
        courseId: { type: String, required: true },
        rating: { type: Number, min: 1, max: 5, required: true },
        comment: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

module.exports = mongoose.model("reviews", reviewSchema);