require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected")
        console.log("DB name:", mongoose.connection.name);
    })
    .catch((err) => console.error("MongoDB error:", err));

// Routes
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

// Register API
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

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));