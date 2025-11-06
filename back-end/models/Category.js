const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
    {
        _id: { type: String },
        name: { type: String, required: true },
        description: { type: String },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

module.exports = mongoose.model("categories", categorySchema);