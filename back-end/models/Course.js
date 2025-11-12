const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
    {
        _id: { type: String },
        title: { type: String, required: true },
        image: { type: String },
        categoryId: { type: String, required: true },
        time: { type: String }, 
        numberOfParticipants: { type: Number },
        numberOfLessons: { type: Number },
        status: { type: Boolean, default: true },
        rating: { type: Number, min: 0, max: 5 },
        price: { type: Number },
        discount: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now }
    },
    { versionKey: false }
);

module.exports = mongoose.model("courses", courseSchema);