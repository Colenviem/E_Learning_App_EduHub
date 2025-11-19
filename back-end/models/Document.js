const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  type: String,       // course | lesson | detail
  sourceId: String,   // COURSE001 / LESSON001 / DETAIL10101
  text: String,       // Nội dung text dùng cho RAG
  vector: [Number],   // Embedding vector
});

module.exports = mongoose.model("Document", DocumentSchema);