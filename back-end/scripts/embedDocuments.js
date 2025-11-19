const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const LessonDetail = require("../models/Lesson_detail");
const Document = require("../models/Document");

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------------- BUILD TEXT ----------------

function buildTextCourse(course, lessons) {
  const lessonNames = lessons.map(l => l.title).join(", ");

  return `
    Type: Course
    Title: ${course.title}
    Number of Lessons: ${course.numberOfLessons}
    Time: ${course.time}
    Participants: ${course.numberOfParticipants}
    Rating: ${course.rating}
    Discount: ${course.discount ? course.discount + " %" : "Không có thông tin"}
    Price: ${course.price ? course.price + " VND" : "Không có thông tin"}
    Lessons: ${lessonNames || "Chưa có"}
  `;
}

function buildTextLesson(l) {
  return `
    Type: Lesson
    Lesson Title: ${l.title}
    Course ID: ${l.courseId}
    Content: ${l.content}
    Details: ${l.lesson_details?.map(x => x.name).join(", ") || "Không có"}
    `;
}

function buildTextDetail(d) {
  return `
  Type: Detail
  Name: ${d.name}
  Video Title: ${d.videoTitle}
  Tasks: ${d.tasks.join(", ")}
  `;
}

// -------------- EMBEDDING --------------------

async function embed(text) {
  const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

async function run() {
  try {
    await Document.deleteMany();

    const courses = await Course.find();
    const lessons = await Lesson.find();
    const details = await LessonDetail.find();

    const docs = [];

    // Courses
    for (let c of courses) {
      const courseLessons = lessons.filter(l => l.courseId === c._id);
      docs.push({
        type: "course",
        sourceId: c._id,
        text: buildTextCourse(c, courseLessons),
      });
    }

    // Lessons
    for (let l of lessons) {
      docs.push({
        type: "lesson",
        sourceId: l._id,
        text: buildTextLesson(l),
      });
    }

    // Details
    for (let d of details) {
      docs.push({
        type: "detail",
        sourceId: d._id,
        text: buildTextDetail(d),
      });
    }

    console.log("Đang tạo embedding...");

    for (let doc of docs) {
      doc.vector = await embed(doc.text);
      await Document.create(doc);
    }

    console.log("✅ Tạo embedding xong!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();