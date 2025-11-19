const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// ✅ GET all notifications
router.get("/", async (req, res) => {
    try {
        const items = await Notification.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ CREATE notification
router.post("/", async (req, res) => {
    try {
        const newItem = new Notification(req.body);
        await newItem.save();
        res.status(201).json(newItem);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Lấy tất cả notifications của một user
router.get("/:userId", async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.params.userId });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ UPDATE notification
router.put("/:id", async (req, res) => {
    try {
        const updated = await Notification.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ DELETE notification
router.delete("/:id", async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;