const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        _id: { type: String },
        accountId: { type: String, required: true },
        name: { type: String, required: true },
        avatarUrl: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }  
);

module.exports = mongoose.model("users", userSchema);