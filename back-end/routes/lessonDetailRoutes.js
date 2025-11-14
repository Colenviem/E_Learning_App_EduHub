const express = require("express");
const router = express.Router();
const LessonDetail = require("../models/Lesson_detail");

// ===================================
// 1️⃣ Lấy tất cả lesson_details
// ===================================
router.get("/", async (req, res) => {
    try {
        const details = await LessonDetail.find().sort({ createdAt: 1 });
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ===================================
// 2️⃣ Lấy lesson_detail theo _id
// ===================================
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const detail = await LessonDetail.findById(id);

        if (!detail)
            return res.status(404).json({ message: "Detail not found with this _id" });

        res.json(detail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;