const express = require("express");
const router = express.Router();
const Lesson = require("../models/Lesson");
const LessonDetail = require("../models/Lesson_detail");

// ===================================
// 1️⃣ Lấy tất cả lesson_details
// ===================================
router.get("/", async (req, res) => {
    try {
        const details = await LessonDetail.find().sort({ createdAt: 1 });
        res.json(details);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post("/update", async (req, res) => {
    try {
        const { userId, seconds } = req.body;

        if (!userId || seconds == null) {
            return res.status(400).json({ message: "Missing userId or seconds" });
        }

        const User = require("../models/User");
        const user = await User.findOne({ accountId: userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // -------------------------
        // 1️⃣ Cộng thời gian học
        // -------------------------
        const minutes = Math.floor(seconds / 60);
        user.totalActiveMinutes += minutes;

        // -------------------------
        // 2️⃣ Tính streak theo ngày
        // -------------------------
        const VN_TZ_OFFSET = 7 * 60 * 60 * 1000; // +7h

        const today = new Date(Date.now() + VN_TZ_OFFSET);
        today.setHours(0, 0, 0, 0);

        const lastLogin = user.lastLogin
            ? new Date(user.lastLogin.getTime() + VN_TZ_OFFSET)
            : null;

        if (lastLogin) {
            lastLogin.setHours(0, 0, 0, 0);
        }

        if (!lastLogin) {
            // Lần đầu học
            user.streak = 1;
        } else {
            const diffDays = Math.floor((today - lastLogin) / (1000 * 60 * 60 * 24));

            if (diffDays === 0) {
                // Đã học hôm nay → không tăng streak
            } else if (diffDays === 1) {
                // Hôm nay học tiếp → tăng streak
                user.streak += 1;
            } else {
                // Bỏ quá 1 ngày → reset streak
                user.streak = 1;
            }
        }

        // Cập nhật ngày học gần nhất
        user.lastLogin = new Date();

        await user.save();

        return res.json({
            message: "Progress + streak updated",
            totalActiveMinutes: user.totalActiveMinutes,
            streak: user.streak,
            lastLogin: user.lastLogin
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


router.get("/detail/:id", async (req, res) => {
    try {
        const detail = await LessonDetail.findById(req.params.id);

        if (!detail)
        return res.status(404).json({ message: "Detail not found" });

        res.json(detail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Lấy danh sách detail theo lessonId
router.get("/lesson/:lessonId", async (req, res) => {
    try {
        const { lessonId } = req.params;

        const detail = await LessonDetail.find({ lessonId });

        if (!detail || detail.length === 0)
        return res.status(404).json({ message: "Details not found for lessonId" });

        res.json(detail);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const lessonId = req.params.id;
        const { title, content, courseId, lessonDetails } = req.body;

        // 1. Cập nhật Lesson chính
        const lesson = await Lesson.findByIdAndUpdate(
            lessonId,
            { title, content, courseId, numberOfLessons: lessonDetails.length },
            { new: true, runValidators: true } // Quan trọng: { new: true } để trả về đối tượng đã cập nhật
        );

        if (!lesson) {
            return res.status(404).json({ message: 'Lesson không tồn tại' });
        }

        // 2. Xóa TẤT CẢ Lesson Details cũ liên quan đến LessonId này
        await LessonDetail.deleteMany({ lessonId: lessonId });

        // 3. Tạo lại TẤT CẢ Lesson Details mới
        if (lessonDetails && lessonDetails.length > 0) {
            const newDetailsData = lessonDetails.map(detail => ({
                _id: detail._id, // Giữ nguyên ID nếu có
                lessonId, // Liên kết với Lesson chính
                name: detail.name,
                videoUrl: detail.videoUrl,
                videoTitle: detail.videoTitle,
                time: detail.time || "N/A", // Cần đảm bảo trường time được xử lý
                tasks: detail.tasks || [],
                quizzes: detail.quizzes || []
            }));
            await LessonDetail.insertMany(newDetailsData);
        }

        // 4. Trả về dữ liệu cập nhật
        const updatedDetails = await LessonDetail.find({ lessonId });

        res.json({ lesson, lessonDetails: updatedDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

module.exports = router;