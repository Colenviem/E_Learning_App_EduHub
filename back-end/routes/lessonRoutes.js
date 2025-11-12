const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");

// ✅ GET all lessons
router.get("/", async (req, res) => {
    try {
        const lessons = await Lesson.find();
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET lessons by courseId
router.get("/course-lessons", async (req, res) => {
    const { id } = req.query; // id = courseId
    try {
        const lessons = await Lesson.find({ courseId: id });
        res.json(lessons);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// ✅ CREATE lesson
router.post("/", async (req, res) => {
    try {
        const newLesson = new Lesson(req.body);
        await newLesson.save();
        res.status(201).json(newLesson);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ GET lesson by ID
router.get("/:id", async (req, res) => {
    try {
        const lesson = await Lesson.findById(req.params.id);
        if (!lesson) return res.status(404).json({ message: "Not found" });
        res.json(lesson);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ UPDATE lesson
router.put("/:id", async (req, res) => {
    try {
        const updated = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ DELETE lesson
router.delete("/:id", async (req, res) => {
    try {
        await Lesson.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;