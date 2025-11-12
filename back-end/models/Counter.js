const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
    _id: { type: String, required: true }, // Tên của bộ đếm, ví dụ: 'accountId'
    seq: { type: Number, default: 0 }     // Số thứ tự cuối cùng
});

module.exports = mongoose.model('Counter', counterSchema);