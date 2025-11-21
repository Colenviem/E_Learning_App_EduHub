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
        
        // 1. TÍNH ĐIỂM TƯƠNG ĐỒNG CHO TẤT CẢ VÀ SẮP XẾP
        const scoredDocs = docs.map(doc => ({
            doc,
            score: cosineSim(queryVector, doc.vector)
        }))
        .sort((a, b) => b.score - a.score); // Sắp xếp giảm dần theo điểm

        // 2. CHỌN TOP K TÀI LIỆU
        const K = 5; 
        const topKDocs = scoredDocs.slice(0, K);

        // 3. LỌC CÁC TÀI LIỆU CÓ ĐIỂM TRÊN NGƯỠNG
        // Ngưỡng 0.45, hoặc có thể hạ xuống 0.40 để bao quát hơn
        const USEFUL_THRESHOLD = 0.45; 
        const usefulContexts = topKDocs
            .filter(item => 
                item.score > USEFUL_THRESHOLD && 
                ["course", "lesson", "detail"].includes(item.doc.type)
            );

        // 4. KIỂM TRA XEM CÓ NÊN SỬ DỤNG NGỮ CẢNH HAY KHÔNG
        const shouldUseContext = usefulContexts.length > 0;

        let finalPrompt;
        let contextText = usefulContexts.map(item => item.doc.text).join("\n---\n"); // Ghép các ngữ cảnh lại

        if (shouldUseContext) {
            // Trường hợp 1: Có tài liệu phù hợp → Dùng RAG
            finalPrompt = `
            Bạn là E-Learning.AI, trợ lý AI cho nền tảng học trực tuyến. 
            Hãy trả lời CHỈ dựa trên dữ liệu dưới đây.

            DỮ LIỆU:
            ${contextText}

            LƯU Ý:
            - Chỉ trả lời từ dữ liệu trên.
            - Nếu thông tin không có trong dữ liệu, trả lời: "Tôi không tìm thấy thông tin phù hợp trong cơ sở dữ liệu".
            - Không sử dụng **, thay bằng dấu -.

            CÂU HỎI:
            ${prompt}
        `;
        } else {
            // Trường hợp 2: KHÔNG có tài liệu nào phù hợp → Fallback về LLM thuần túy
            // Chỉ truyền câu hỏi gốc cho mô hình để nó trả lời bằng kiến thức chung.
            finalPrompt = `
                Bạn là E-Learning.AI, một trợ lý AI. 
                Câu hỏi dưới đây không có dữ liệu phù hợp trong cơ sở dữ liệu, 
                vì vậy hãy trả lời dựa trên kiến thức chung của bạn.

                CÂU HỎI:
                ${prompt}
            `;
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.0-flash-lite",
        });

        const result = await model.generateContent(finalPrompt);
            res.json({
                answer: result.response.text(),
                matched: usefulContexts.length > 0 ? "multiple" : "none", 
                score: usefulContexts.length > 0 ? usefulContexts[0].score : -1,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "AI error" });
        }
});

module.exports = router;