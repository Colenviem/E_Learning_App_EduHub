const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Document = require('../models/Document');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ĐỊNH NGHĨA NGƯỠNG TƯƠNG ĐỒNG
// Bạn có thể điều chỉnh con số này (từ 0.0 đến 1.0)
// 0.75 là một khởi đầu tốt, nghĩa là "khá tương đồng"
const SIMILARITY_THRESHOLD = 0.75;

// Cosine similarity (Code của bạn đã đúng)
function cosineSim(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const normA = Math.sqrt(a.reduce((sum, val) => sum + val*val, 0));
  const normB = Math.sqrt(b.reduce((sum, val) => sum + val*val, 0));
  return dot / (normA * normB);
}

router.post('/ask-gemini', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Vui lòng cung cấp "prompt"' });

    // --- 1. TẠO EMBEDDING CHO CÂU HỎI ---
    const embeddingModel = genAI.getGenerativeModel({ 
      model: "text-embedding-004"
    });
    const embeddingResult = await embeddingModel.embedContent(prompt);
    const queryVector = embeddingResult.embedding.values;

    // --- 2. TÌM TÀI LIỆU TƯƠNG ĐỒNG NHẤT ---
    const docs = await Document.find();
    let bestDoc = null;
    let bestScore = -1;
    for (let doc of docs) {
      const sim = cosineSim(queryVector, doc.vector);
      if (sim > bestScore) {
        bestScore = sim;
        bestDoc = doc;
      }
    }

    // --- 3. QUYẾT ĐỊNH VÀ TẠO CÂU TRẢ LỜI ---
    
    let augmentedPrompt = ""; // Prompt cuối cùng sẽ gửi cho AI
    
    // Kiểm tra xem điểm tương đồng có VƯỢT QUA NGƯỠNG không
    if (bestDoc && bestScore > SIMILARITY_THRESHOLD) {
      // NẾU CÓ: Câu hỏi liên quan đến khóa học -> Thêm context
      console.log(`Tìm thấy context liên quan (Score: ${bestScore.toFixed(2)})`);
      const context = bestDoc.text;
      augmentedPrompt = `Dựa trên thông tin sau:\n"${context}"\n\nTrả lời câu hỏi: ${prompt}`;
    } else {
      // NẾU KHÔNG: Câu hỏi chung -> Không thêm context
      console.log(`Không tìm thấy context liên quan (Score: ${bestScore.toFixed(2)}). Trả lời chung.`);
      augmentedPrompt = prompt; // Chỉ gửi câu hỏi gốc
    }

    // 3a. Lấy mô hình generative
    const generativeModel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash" 
    });

    // 3b. Gọi .generateContent() với prompt đã được xử lý
    const result = await generativeModel.generateContent(augmentedPrompt);
    
    // 3c. Lấy text
    const text = result.response.text(); 

    res.json({ answer: text });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Lỗi server AI' });
  }
});

module.exports = router;