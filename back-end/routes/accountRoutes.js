const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dns = require("dns").promises;

const Account = require("../models/Account");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const { getNextSequence } = require("../utils/sequenceGenerator");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

router.get("/", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/profile/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;

    const account = await Account.findById(accountId);
    if (!account)
      return res.status(404).json({ message: "Account không tồn tại" });

    const user = await User.findOne({ accountId });
    if (!user)
      return res.status(404).json({ message: "User không tồn tại" });

    res.json({
      success: true,
      account,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});


router.get("/check-email", async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const exists = await Account.exists({ email });
    res.json({ exists: !!exists });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const account = await Account.findById(req.params.id);
    if (!account) return res.status(404).json({ message: "Account không tìm thấy" });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/send-otp", async (req, res) => {
  try {
    const { email, type = "register" } = req.body;
    if (!email) return res.status(400).json({ message: "Thiếu email" });

    const domain = email.split("@")[1];
    try {
      const mx = await dns.resolveMx(domain);
      if (!mx || mx.length === 0)
        return res.status(400).json({ message: "Email domain không hợp lệ" });
    } catch {}

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    global._otpStore = global._otpStore || {};
    global._otpStore[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000,
      used: false,
      type,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"EduHub" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mã xác thực EduHub",
      html: `<h3>Mã xác thực của bạn là:</h3><h1 style="color: #4CAF50;">${otp}</h1><p>Mã có hiệu lực trong 10 phút.</p>`,
    });

    res.json({ success: true, message: "OTP đã gửi thành công" });
  } catch (err) {
    console.error("Send OTP error:", err);
    res.status(500).json({ message: "Lỗi server khi gửi OTP", error: err.message });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Thiếu email hoặc OTP" });

    const record = global._otpStore?.[email];
    if (!record || record.used || record.otp !== otp || Date.now() > record.expiresAt)
      return res.status(400).json({ verified: false, message: "OTP không hợp lệ hoặc đã hết hạn" });

    record.used = true;
    res.json({ verified: true, message: "Xác thực OTP thành công" });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi xác thực OTP" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const accountSeq = await getNextSequence("accountId");
    const accountId = `ACC${accountSeq.toString().padStart(3, "0")}`;

    const account = new Account({
      _id: accountId,
      email,
      password: hashedPassword,
      role: "STUDENT",
      status: true,
      createdAt: new Date(),
    });
    await account.save();

    const userSeq = await getNextSequence("userId");
    const userId = `USER${userSeq.toString().padStart(3, "0")}`;

    const user = new User({
      _id: userId,
      accountId: account._id,
      name,
      avatarUrl: "https://res.cloudinary.com/db8tb8tzi/image/upload/v1762867632/Avatar-Nu-Dep-14_1_sy7dmf.jpg",
      coursesInProgress: [],
      createdAt: new Date(),
    });
    await user.save();

    res.status(201).json({ message: "Đăng ký thành công", account, user });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const accounts = await Account.find({ email });
    if (!accounts || accounts.length === 0)
      return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không chính xác" });

    let matchedUser = null;
    for (const acc of accounts) {
      if (await bcrypt.compare(password, acc.password)) {
        matchedUser = acc;
        break;
      }
    }

    if (!matchedUser)
      return res.status(401).json({ message: "Tài khoản hoặc mật khẩu không chính xác" });

    const token = jwt.sign(
      { userId: matchedUser._id, role: matchedUser.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: { _id: matchedUser._id, email: matchedUser.email, role: matchedUser.role },
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/change-password/:accountId", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const account = await Account.findById(req.params.accountId);
    if (!account) return res.status(404).json({ message: "Account not found" });

    const isMatch = await bcrypt.compare(currentPassword, account.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    account.password = hashed;

    await account.save();

    res.json({ message: "Đổi mật khẩu thành công" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


router.get("/me", authMiddleware, async (req, res) => {
  const user = await Account.findById(req.user.userId);
  res.json(user);
});

router.put("/:id", async (req, res) => {
  try {
    const updates = req.body;
    const account = await Account.findByIdAndUpdate(req.params.id, updates, { new: true });

    if (!account) return res.status(404).json({ message: "Account không tìm thấy" });

    res.json({ message: "Cập nhật thành công", account });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.post("/register-admin", async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const accountSeq = await getNextSequence("accountId");
    const accountId = `ACC${accountSeq.toString().padStart(3, "0")}`;

    const account = new Account({
      _id: accountId,
      email,
      password: hashedPassword,
      role,
      status: true,
      createdAt: new Date(),
    });
    await account.save();

    res.status(201).json({ message: "Đăng ký thành công", account, success: true });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server" });
  }
});

router.put("/update-profile/:accountId", async (req, res) => {
  try {
    const { accountId } = req.params;
    const { name, email, avatarUrl } = req.body;

    const account = await Account.findById(accountId);
    if (!account)
      return res.status(404).json({ message: "Account không tồn tại" });

    if (email) account.email = email;
    await account.save();

    const user = await User.findOne({ accountId });
    if (!user)
      return res.status(404).json({ message: "User không tồn tại" });

    if (name) user.name = name;
    if (avatarUrl) user.avatarUrl = avatarUrl;

    await user.save();

    res.json({
      success: true,
      message: "Cập nhật hồ sơ thành công!",
      account,
      user,
    });
  } catch (err) {
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
});


module.exports = router;
