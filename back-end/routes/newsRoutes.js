const express = require('express');
const router = express.Router();
const News = require('../models/News');

// Lấy tất cả news
router.get('/', async (req, res) => {
  try {
    const news = await News.find().sort({ createdAt: -1 });
    res.json(news);
  } catch (err) {
    console.error('Lỗi GET /news:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findOne({ _id: id }); // dùng string match
    if (!news) return res.status(404).json({ message: 'News not found' });
    res.json(news);
  } catch (err) {
    console.error('Lỗi GET /news/:id:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Tạo news mới
router.post('/', async (req, res) => {
  const { id, title, date, imageUrl, category, likes, comments } = req.body;

  const news = new News({
    _id: id || Date.now().toString(), // nếu không có id thì dùng timestamp string
    title,
    date,
    imageUrl,
    category,
    likes: likes || 0,
    comments: comments || [],
  });

  try {
    const newNews = await news.save();
    res.status(201).json(newNews);
  } catch (err) {
    console.error('Lỗi POST /news:', err);
    res.status(400).json({ message: err.message });
  }
});

// Cập nhật news
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findOne({ _id: id });
    if (!news) return res.status(404).json({ message: 'News not found' });

    const { title, date, imageUrl, category, likes, comments } = req.body;
    if (title !== undefined) news.title = title;
    if (date !== undefined) news.date = date;
    if (imageUrl !== undefined) news.imageUrl = imageUrl;
    if (category !== undefined) news.category = category;
    if (likes !== undefined) news.likes = likes;
    if (comments !== undefined) news.comments = comments;

    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (err) {
    console.error('Lỗi PUT /news/:id:', err);
    res.status(400).json({ message: err.message });
  }
});

// Xóa news
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findOne({ _id: id });
    if (!news) return res.status(404).json({ message: 'News not found' });

    await news.deleteOne();
    res.json({ message: 'News deleted' });
  } catch (err) {
    console.error('Lỗi DELETE /news/:id:', err);
    res.status(500).json({ message: err.message });
  }
});


router.put('/:id/like', async (req, res) => {
  const { id } = req.params;

  try {
    const news = await News.findOne({ _id: id });
    if (!news) return res.status(404).json({ message: 'News not found' });

    news.likes = (news.likes || 0) + 1;
    const updatedNews = await news.save();
    return res.json(updatedNews);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/:id/comment', async (req, res) => {
  try {
    const news = await News.findById(req.params.id);
    if (!news) return res.status(404).json({ message: 'News not found' });
    news.comments.push(req.body);
    const updatedNews = await news.save();
    res.json(updatedNews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
