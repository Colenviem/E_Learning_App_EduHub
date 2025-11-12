const Counter = require('../models/Counter');

async function getNextSequence(name) {
    const counter = await Counter.findOneAndUpdate(
        { _id: name },               // 1. TÌM: Tìm document có _id là 'accountId'
        { $inc: { seq: 1 } },        // 2. TĂNG: Tăng trường 'seq' lên 1
        { new: true, upsert: true }  // 3. TÙY CHỌN
    );
    return counter.seq; // 4. TRẢ VỀ: Trả ra con số MỚI (ví dụ: 1)
}

module.exports = { getNextSequence };