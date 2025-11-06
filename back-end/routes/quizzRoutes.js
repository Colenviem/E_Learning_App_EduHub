const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quizz");

// ✅ GET all quizzes
router.get("/", async (req, res) => {
    try {
        const items = await Quiz.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ CREATE quiz
router.post("/", async (req, res) => {
    try {
        const newItem = new Quiz(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ GET quiz by ID
router.get("/:id", async (req, res) => {
    try {
        const item = await Quiz.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ UPDATE quiz
router.put("/:id", async (req, res) => {
    try {
        const updated = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ DELETE quiz
router.delete("/:id", async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;