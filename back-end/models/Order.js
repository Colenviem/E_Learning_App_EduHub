const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    _id: { type: String },
    userId: { type: String, required: true },
    courseId: { type: String, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

module.exports = mongoose.model('orders', orderSchema);