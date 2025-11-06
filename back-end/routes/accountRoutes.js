const express = require("express");
const router = express.Router();
const Account = require("../models/Account");

// ✅ GET all accounts
router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ CREATE account
router.post("/", async (req, res) => {
    try {
        const newAccount = new Account(req.body);
        await newAccount.save();
        res.status(201).json(newAccount);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ GET account by ID
router.get("/:id", async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) return res.status(404).json({ message: "Not found" });
        res.json(account);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ✅ UPDATE account
router.put("/:id", async (req, res) => {
    try {
        const updated = await Account.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.json(updated);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// ✅ DELETE account
router.delete("/:id", async (req, res) => {
    try {
        await Account.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;