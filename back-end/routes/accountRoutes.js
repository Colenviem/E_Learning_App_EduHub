const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dns = require("dns").promises;

const Account = require("../models/Account");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { getNextSequence } = require('../utils/sequenceGenerator');

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// ✅ GET all categories
router.get("/", async (req, res) => {
    try {
        const accounts = await Account.find();
        res.json(accounts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ==================== GỬI OTP ====================
router.post("/send-otp", async (req, res) => {
  try {
    const { email, type = "register" } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    // Kiểm tra domain
    const domain = email.split("@")[1];
    try {
      const mx = await dns.resolveMx(domain);
      if (!mx || mx.length === 0)
        return res.status(400).json({ message: "Email domain không hợp lệ" });
    } catch {
      console.warn("Không kiểm tra được MX record, tiếp tục gửi...");
    }

    // Sinh OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Lưu OTP tạm vào bộ nhớ
    global._otpStore = global._otpStore || {};
    global._otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      used: false,
      type,
    };

    // Cấu hình Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Gửi mail
    await transporter.sendMail({
      from: `"EduHub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mã xác thực EduHub",
      html: `
        <h3>Mã xác thực của bạn là:</h3>
        <h1 style="color: #4CAF50;">${otp}</h1>
        <p>Mã có hiệu lực trong <b>10 phút</b>.</p>
      `,
    });

    res.json({ success: true, message: "OTP đã gửi thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi gửi OTP" });
  }
});

// ==================== XÁC THỰC OTP ====================
router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Thiếu email hoặc OTP" });

    const record = global._otpStore?.[email];
    if (!record || record.used || record.otp !== otp || Date.now() > record.expiresAt) {
      return res.status(400).json({ verified: false, message: "OTP không hợp lệ hoặc đã hết hạn" });
    }

    record.used = true;
    res.json({ verified: true, message: "Xác thực OTP thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server khi xác thực OTP" });
  }
});

// ==================== CHECK EMAIL ====================
router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const exists = await Account.exists({ email });
    res.json({ exists: !!exists });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo accountId
    const accountSeq = await getNextSequence('accountId');
    const accountId = `ACC${accountSeq.toString().padStart(3, "0")}`;

    // Lưu Account
    const account = new Account({
      _id: accountId,
      email,
      password: hashedPassword,
      role: "STUDENT",
      status: true,
      createdAt: new Date(),
    });
    await account.save();

    // Tạo userId
    const userSeq = await getNextSequence('userId'); 
    const userId = `USER${userSeq.toString().padStart(3, "0")}`;

    // Lưu User
    const user = new User({
      _id: userId, // <-- Dùng ID an toàn
      accountId: account._id,
      name,
      avatarUrl: "https://res.cloudinary.com/db8tb8tzi/image/upload/v1762867632/Avatar-Nu-Dep-14_1_sy7dmf.jpg",
      coursesInProgress: [],
      createdAt: new Date(),
    });
    await user.save();

    res.status(201).json({ message: "Đăng ký thành công", account, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const users = await Account.find({ email });
  if (!users || users.length === 0)
    return res.status(401).json({ message: "Email không tồn tại" });

  let matchedUser = null;
  for (const user of users) {
    if (await bcrypt.compare(password, user.password)) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) return res.status(401).json({ message: "Mật khẩu không đúng" });

  const token = jwt.sign(
    { userId: matchedUser._id, role: matchedUser.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({
    token,
    user: { _id: matchedUser._id, email: matchedUser.email, username: matchedUser.username },
  });
});

// ==================== GET PROFILE (Protected) ====================
router.get("/me", authMiddleware, async (req, res) => {
  const user = await Account.findById(req.user.userId);
  res.json(user);
});

module.exports = router;