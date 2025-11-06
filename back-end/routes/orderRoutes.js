const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ GET all orders
router.get("/", async (req, res) => {
    try {
        const items = await Order.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ CREATE order
router.post("/", async (req, res) => {
    try {
        const newItem = new Order(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ GET order by ID
router.get("/:id", async (req, res) => {
    try {
        const item = await Order.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ UPDATE order
router.put("/:id", async (req, res) => {
    try {
        const updated = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ DELETE order
router.delete("/:id", async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;