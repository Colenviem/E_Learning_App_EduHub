const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const User = require("../models/User");
const streamifier = require("streamifier");

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/byAccount/:accountId", async (req, res) => {
  try {
    const user = await User.findOne({ accountId: req.params.accountId });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/byAccount/:accountId", async (req, res) => {
  try {
    const { name, backgroundColor, avatarUrl } = req.body;
    const user = await User.findOne({ accountId: req.params.accountId });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) user.name = name;
    if (backgroundColor) user.backgroundColor = backgroundColor;

    if (avatarUrl) {
      if (avatarUrl.startsWith("http")) user.avatarUrl = avatarUrl;
      else return res.status(400).json({ message: "Invalid avatarUrl" });
    }

    await user.save();
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.patch("/byAccount/:accountId/courses", async (req, res) => {
  try {
    const { coursesInProgress } = req.body;

    const user = await User.findOne({ accountId: req.params.accountId });

    if (!user) return res.status(404).json({ message: "User not found" });

    user.coursesInProgress = coursesInProgress;

    await user.save();

    res.json({ message: "Courses updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.post("/byAccount/:accountId/avatar", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const streamUpload = (buffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "avatars" },
          (err, result) => (err ? reject(err) : resolve(result))
        );
        streamifier.createReadStream(buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req.file.buffer);

    const user = await User.findOneAndUpdate(
      { accountId: req.params.accountId },
      { avatarUrl: result.secure_url },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Avatar uploaded successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
