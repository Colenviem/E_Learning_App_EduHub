const express = require("express");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const Post = require("../models/Post");

const router = express.Router();

// Cấu hình multer + cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: { folder: "posts", allowed_formats: ["jpg", "png", "jpeg"] },
});
const parser = multer({ storage });

// POST tạo bài viết kèm ảnh
router.post("/", parser.single("image"), async (req, res) => {
  try {
    const { topic, content } = req.body;
    let imageUrl = req.file?.path || null;
    const post = new Post({ topic, content, image: imageUrl, likes: 0, comments: [] });
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET tất cả bài viết
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET bài viết theo ID
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT like bài viết
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    post.likes = (post.likes || 0) + 1;
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST comment bài viết
router.post("/:id/comment", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const { text } = req.body;
    if (!text || !text.trim()) return res.status(400).json({ message: "Comment rỗng" });

    post.comments.push({ text, createdAt: new Date() });
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
