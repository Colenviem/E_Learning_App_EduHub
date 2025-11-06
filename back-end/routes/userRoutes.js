const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
    const users = await User.find();
    res.json(users);
});

router.post("/", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "Not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.put("/:id", async (req, res) => {
    try {
            const user = await User.findByIdAndUpdate(
                req.params.id, 
                req.body, 
                {
                    new: true,
                }
            );
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;