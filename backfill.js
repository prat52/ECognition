import axios from "axios";
import mongoose from "mongoose";
import { Courses } from "../models/Courses.js";

await mongoose.connect(process.env.MONGO_URI);

const courses = await Courses.find({ embedding: { $size: 0 } });

for (const course of courses) {
  const text = `${course.title}. ${course.category}. ${course.description}`;

  const { data } = await axios.post(
    "http://localhost:8001/embed",
    { text }
  );

  course.embedding = data.embedding;
  await course.save();
}

console.log("✅ Backfill completed");
process.exit();
