const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

const JWT_SECRET = "supersecretkey";

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo _id mới cho Account
    const lastAccount = await Account.findOne().sort({ _id: -1 }).exec();
    let accountNumber = 1;
    if (lastAccount) {
      const match = lastAccount._id.match(/ACC0*(\d+)/);
      if (match) accountNumber = parseInt(match[1], 10) + 1;
    }
    const accountId = `USER${accountNumber.toString().padStart(3, '0')}`;

    const account = new Account({
      _id: accountId,
      email,
      password: hashedPassword,
      role: "STUDENT",
      status: true,
      createdAt: new Date(),
    });
    await account.save();

    // Tạo _id mới cho User
    const lastUser = await User.findOne().sort({ _id: -1 }).exec();
    let userNumber = 1;
    if (lastUser) {
      const match = lastUser._id.match(/USER0*(\d+)/);
      if (match) userNumber = parseInt(match[1], 10) + 1;
    }
    const userId = `USER${userNumber.toString().padStart(3, '0')}`;

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
    console.error(err);
    res.status(500).json({ message: "Lỗi server" });
  }
});


// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Tìm tất cả account có email
  const users = await Account.find({ email });
  if (!users || users.length === 0) {
    return res.status(401).json({ message: "Email không tồn tại" });
  }

  // Kiểm tra mật khẩu
  let matchedUser = null;
  for (const user of users) {
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      matchedUser = user;
      break;
    }
  }

  if (!matchedUser) {
    return res.status(401).json({ message: "Mật khẩu không đúng" });
  }

  // Tạo token
  const token = jwt.sign(
    { userId: matchedUser._id, role: matchedUser.role },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token, user: { _id: matchedUser._id, email: matchedUser.email, username: matchedUser.username } });
});

// GET PROFILE (protected)
router.get('/me', authMiddleware, async (req, res) => {
  const user = await Account.findById(req.user.userId);
  res.json(user);
});

module.exports = router;