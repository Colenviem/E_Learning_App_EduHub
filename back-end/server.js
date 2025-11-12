require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
    console.log("📦 DB name:", mongoose.connection.name);
  })
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const accountRoutes = require("./routes/accountRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const commentRoutes = require("./routes/commentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const orderRoutes = require("./routes/orderRoutes");
const quizzRoutes = require("./routes/quizzRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const newsRoutes = require("./routes/newsRoutes");  
const postRoutes = require("./routes/postRoutes");  

app.use("/accounts", accountRoutes);
app.use("/users", userRoutes);
app.use("/categories", categoryRoutes);
app.use("/comments", commentRoutes);
app.use("/courses", courseRoutes);
app.use("/lessons", lessonRoutes);
app.use("/notifications", notificationRoutes);
app.use("/orders", orderRoutes);
app.use("/quizzes", quizzRoutes);
app.use("/reviews", reviewRoutes);
app.use("/news", newsRoutes);
app.use("/posts", postRoutes);

const cloudinary = require("./config/cloudinary");
if (cloudinary.config().cloud_name) {
  console.log("☁️ Cloudinary connected:", cloudinary.config().cloud_name);
} else {
  console.warn("⚠️ Cloudinary not configured properly");
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
