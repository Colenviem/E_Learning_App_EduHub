const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    _id: { type: String }, 
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    date: { type: String }, 
    imageUrl: { type: String },
    category: { type: String },
    comments: [commentSchema],
    likes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

newsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("news", newsSchema);
