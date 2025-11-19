const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Document = require("../models/Document");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function cosineSim(a, b) {
  const dot = a.reduce((sum, v, i) => sum + v * b[i], 0);
  const normA = Math.sqrt(a.reduce((s, v) => s + v * v, 0));
  const normB = Math.sqrt(b.reduce((s, v) => s + v * v, 0));
  return dot / (normA * normB);
}

router.post("/ask-gemini", async (req, res) => {
  try {
    const { prompt } = req.body;

    const embedModel = genAI.getGenerativeModel({
      model: "text-embedding-004",
    });

    const embedResult = await embedModel.embedContent(prompt);
    const queryVector = embedResult.embedding.values;

    const docs = await Document.find();
    let bestDoc = null;
    let bestScore = -1;

    // Find best match
    for (let doc of docs) {
        const sim = cosineSim(queryVector, doc.vector);
        if (sim > bestScore) {
            bestScore = sim;
            bestDoc = doc;
        }
    }

    const shouldUseContext =
        bestDoc && bestScore > 0.45 && ["course", "lesson", "detail"].includes(bestDoc.type);

    let finalPrompt;

    if (shouldUseContext) {
        finalPrompt = `
            Bạn là E-Learning.AI, một trợ lý AI cho nền tảng học trực tuyến. Hãy sử dụng dữ liệu được trích xuất bên dưới để trả lời câu hỏi.

            DƯỚI ĐÂY LÀ DỮ LIỆU ĐƯỢC TRÍCH XUẤT:
            ${bestDoc.text}

            NHIỆM VỤ:
            - Chỉ sử dụng thông tin từ dữ liệu trên.
            - Khi trả lời, đừng dùng ** để in đậm. Thay toàn bộ bằng dấu gạch đầu dòng -

            CÂU HỎI:
            ${prompt}
        `;
    } else {
      finalPrompt = prompt;
    }

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-lite",
    });

    const result = await model.generateContent(finalPrompt);
        res.json({
            answer: result.response.text(),
            matched: bestDoc?.type,
            score: bestScore,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "AI error" });
    }
});

module.exports = router;
