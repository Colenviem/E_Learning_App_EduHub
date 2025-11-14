const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const { getNextSequence } = require('../utils/sequenceGenerator');

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
router.post('/', async (req, res) => {
    try {
        const { userId, courseId, amount, paymentMethod } = req.body;

        if (!userId || !courseId || !amount || !paymentMethod) {
            return res.status(400).json({ message: 'Thiếu dữ liệu bắt buộc' });
        }

        const orderSeq = await getNextSequence('orderId');
        const orderId = `ORDER${orderSeq.toString().padStart(3, '0')}`;

        const order = new Order({
            _id: orderId,
            userId,
            courseId,
            amount: Number(amount),
            paymentMethod,
            status: 'completed',
            createdAt: new Date(),
        });

        await order.save();
        res.status(201).json(order);
    } catch (err) {
        console.error(err);
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