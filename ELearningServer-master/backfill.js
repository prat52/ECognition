import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import { Courses } from "./models/Courses.js";

// ✅ LOAD ENV VARIABLES
dotenv.config();

// ✅ DEBUG (optional)
console.log("Mongo URI:", process.env.DB);

// ✅ CONNECT
await mongoose.connect(process.env.DB);

// ✅ FIND COURSES WITHOUT EMBEDDINGS
const courses = await Courses.find({
  embedding: { $exists: false }
});

// ✅ BACKFILL
for (const course of courses) {
  const text = `${course.title}. ${course.category}. ${course.description}`;

  const { data } = await axios.post(
    "http://localhost:8001/embed",
    { text }
  );

  course.embedding = data.embedding;
  await course.save();

  console.log(`✅ Embedded: ${course.title}`);
}

console.log("✅ Backfill completed");
process.exit();
