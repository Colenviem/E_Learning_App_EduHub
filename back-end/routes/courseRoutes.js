const express = require("express");
const router = express.Router();
const Course = require("../models/Course");

// ✅ Get all courses
router.get("/", async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Create course
router.post("/", async (req, res) => {
    try {
        const newCourse = new Course(req.body);
        await newCourse.save();
        res.status(201).json(newCourse);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/top-rated", async (req, res) => {
    try {
        const topCourses = await Course.find({ status: true }) 
            .sort({ rating: -1 }) 
            .limit(5);
        res.json(topCourses);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Get course by ID
router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: "Not found" });
        res.json(course);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ Update course
router.put("/:id", async (req, res) => {
    try {
        req.body.updatedAt = new Date();
        const updated = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ Delete course
router.delete("/:id", async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;