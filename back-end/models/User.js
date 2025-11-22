const mongoose = require("mongoose");

const courseProgressSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  image: { type: String },
  progress: { type: Number, default: 0 },
  isFavorite: { type: Boolean, default: false }
}, { _id: false });

const preferencesSchema = new mongoose.Schema({
  notifications: { type: Boolean, default: true },
  dailyGoalMinutes: { type: Number, default: 30 },
  learningReminders: { type: Boolean, default: true },
  account_type: { type: String, default: "Cơ bản" }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    _id: { type: String },
    accountId: { type: String, required: true },
    name: { type: String, required: true },
    avatarUrl: { type: String },
    backgroundColor: { type: String, default: "#B3EBC8" },
    coursesInProgress: { type: [courseProgressSchema], default: [] },
    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null },

    totalActiveMinutes: { type: Number, default: 0 },
    preferences: { type: preferencesSchema, default: () => ({}) }
  },
  { versionKey: false }
);

module.exports = mongoose.model("users", userSchema);
