const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
    {
        _id: { type: String },
        option: { type: String, required: true },
        correct: { type: Boolean, default: false },
    },
);

const quizSchema = new mongoose.Schema(
    {
        _id: { type: String },
        type: {
            type: String,
            enum: ["single_choice", "multiple_choice", "true_false"],
            default: "single_choice"
        },
        question: { type: String, required: true },
        options: [optionSchema],
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
);

module.exports = mongoose.model("quizzes", quizSchema);