const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// ✅ GET all reviews
router.get("/", async (req, res) => {
    try {
        const items = await Review.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ CREATE review
router.post("/", async (req, res) => {
    try {
        const newItem = new Review(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ GET review by ID
router.get("/:id", async (req, res) => {
    try {
        const item = await Review.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ UPDATE review
router.put("/:id", async (req, res) => {
    try {
        const updated = await Review.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ DELETE review
router.delete("/:id", async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;