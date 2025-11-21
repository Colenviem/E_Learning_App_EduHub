const express = require("express");
const multer = require("multer");
const os = require("os");  
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const Post = require("../models/Post");

const router = express.Router();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const upload = multer({ dest: os.tmpdir() });


router.post("/", async (req, res) => {
  try {
    const { topic, content, image } = req.body;

    const post = new Post({
      topic,
      content,
      image: image || null,
      likes: 0,
      comments: [],
    });

    await post.save();

    res.status(201).json(post);
  } catch (err) {
    console.log("Create post error:", err);
    res.status(500).json({ error: "Create post failed" });
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
