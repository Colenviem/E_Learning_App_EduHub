const mongoose = require('mongoose');

const docSchema = new mongoose.Schema({
  text: String,
  vector: { type: [Number], index: '2dsphere' }, // dùng vector lưu embedding
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Document', docSchema);