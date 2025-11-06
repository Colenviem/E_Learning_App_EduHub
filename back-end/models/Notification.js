const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        _id: { type: String },
        userId: { type: String, required: true },
        type: { type: String, required: true },   // ex: lesson, system
        message: { type: String, required: true },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

module.exports = mongoose.model("notifications", notificationSchema);