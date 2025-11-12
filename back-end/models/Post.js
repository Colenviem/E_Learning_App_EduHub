const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const PostSchema = new mongoose.Schema({
  topic: { type: String, required: true },
  content: { type: String, required: true },
  image: { type: String, default: null },
  likes: { type: Number, default: 0 },
  comments: [CommentSchema],
  category: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Post", PostSchema);
