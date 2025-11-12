const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Lấy tất cả user
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy user theo ID
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Lấy user theo accountId
router.get("/byAccount/:accountId", async (req, res) => {
  try {
    const user = await User.findOne({ accountId: req.params.accountId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tạo user mới
router.post("/", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật user
router.put("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const now = new Date();

    if (user.lastLogin) {
      const diffDays = Math.floor((now - user.lastLogin) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) user.streak = (user.streak || 0) + 1;
      else if (diffDays > 1) user.streak = 1;
    } else {
      user.streak = 1;
    }

    user.lastLogin = now;
    if (req.body.sessionMinutes) user.totalActiveMinutes = (user.totalActiveMinutes || 0) + req.body.sessionMinutes;
    if (req.body.name) user.name = req.body.name;
    if (req.body.avatarUrl) user.avatarUrl = req.body.avatarUrl;
    if (req.body.backgroundColor) user.backgroundColor = req.body.backgroundColor;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Upload avatar lên Cloudinary
router.post("/:id/avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream({ folder: "avatars" }, (err, result) => {
          if (result) resolve(result);
          else reject(err);
        });
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { avatarUrl: result.secure_url },
      { new: true }
    );

    res.json({ message: "Avatar uploaded successfully", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
