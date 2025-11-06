const express = require("express");
const router = express.Router();
const Comment = require("../models/Comment");

// ✅ GET all comments
router.get("/", async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ CREATE comment
router.post("/", async (req, res) => {
    try {
        const newComment = new Comment(req.body);
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ GET comment by ID
router.get("/:id", async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Not found" });
        res.json(comment);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ UPDATE comment
router.put("/:id", async (req, res) => {
    try {
        const updated = await Comment.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ DELETE comment
router.delete("/:id", async (req, res) => {
    try {
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;