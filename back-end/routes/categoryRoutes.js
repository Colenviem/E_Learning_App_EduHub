const express = require("express");
const router = express.Router();
const Category = require("../models/Category");

// ✅ GET all categories
router.get("/", async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ CREATE category
router.post("/", async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json(newCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ GET category by ID
router.get("/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: "Not found" });
        res.json(category);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ UPDATE category
router.put("/:id", async (req, res) => {
    try {
        const updated = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ DELETE category
router.delete("/:id", async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;