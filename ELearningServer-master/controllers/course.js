import { instance } from "../index.js";
import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import { User } from "../models/User.js";
import crypto from "crypto";
import { Payment } from "../models/Payment.js";
import { Progress } from "../models/Progress.js";
import redis from "../config/redis.js"
import { createEmbedding } from "../services/embeddingService.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";

const TRENDING_KEY = "trending_courses";
const TRENDING_TTL = 6 * 3600;


export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);

  res.json({
    course,
  });
});

export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lectures });
});

export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);

  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course))
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });

  res.json({ lecture });
});

export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({
    courses,
  });
});

export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100),
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(201).json({
    order,
    course,
  });
});

export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_Secret)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

//todo:fixing issues
// const isAuthentic = expectedSignature === razorpay_signature;

if (!isAuthentic) {
  return res.status(400).json({
    message: "Payment Failed",
  });
}

//todo:uptill here

  if (isAuthentic) {
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    const user = await User.findById(req.user._id);

    const course = await Courses.findById(req.params.id);

    user.subscription.push(course._id);

    await Progress.create({
      course: course._id,
      completedLectures: [],
      user: req.user._id,
    });

    await user.save();

    res.status(200).json({
      message: "Course Purchased Successfully",
    });
  } else {
    return res.status(400).json({
      message: "Payment Failed",
    });
  }
});

export const addProgress = TryCatch(async (req, res) => {
  const progress = await Progress.findOne({
    user: req.user._id,
    course: req.query.course,
  });

  const { lectureId } = req.query;

  if (progress.completedLectures.includes(lectureId)) {
    return res.json({
      message: "Progress recorded",
    });
  }

  progress.completedLectures.push(lectureId);

  await progress.save();

  res.status(201).json({
    message: "new Progress added",
  });
});

export const getYourProgress = TryCatch(async (req, res) => {
  const progress = await Progress.find({
    user: req.user._id,
    course: req.query.course,
  });

  if (!progress) return res.status(404).json({ message: "null" });

  const allLectures = (await Lecture.find({ course: req.query.course })).length;

  const completedLectures = progress[0].completedLectures.length;

  const courseProgressPercentage = (completedLectures * 100) / allLectures;

  res.json({
    courseProgressPercentage,
    completedLectures,
    allLectures,
    progress,
  });
});


export const getTrending = TryCatch(async (req, res) => {
  // 1. Try to read from redis
  const cached = await redis.get(TRENDING_KEY);
  if (cached) {
    // cached value exists -> return it
    const data = JSON.parse(cached);
    return res.status(200).json({ success: true, courses: data, source: "cache" });
  }

  // 2. Cache miss -> fetch from DB
  const courses = await Courses.find({ isTrending: true }).limit(20).lean();

  // 3. Save into redis
  await redis.set(TRENDING_KEY, JSON.stringify(courses), { EX: TRENDING_TTL });

  // 4. Return
  res.status(200).json({ success: true, courses, source: "db" });
});


// PUT /api/admin/course/:id/trending
// body: { isTrending: true/false }
export const toggleTrending = TryCatch(async (req, res) => {
  const { id } = req.params;

  const course = await Courses.findById(id);

  if (!course) {
    return res.status(404).json({ success: false, message: "Course not found" });
  }

  // Auto toggle
  course.isTrending = !course.isTrending;
  await course.save();

  // Clear cache
  await redis.del(TRENDING_KEY);

  res.status(200).json({
    success: true,
    message: "Trending status updated",
    course
  });
});



export const Search = TryCatch(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      success: false,
      message: "Search query is required",
    });
  }

  //  Create embedding for user query
  const queryEmbedding = await createEmbedding(query);

  //  Fetch all courses that have embeddings
  const courses = await Courses.find({
    embedding: { $exists: true },
  });

  //  Set threshold & result limit
  const THRESHOLD = 0.35;       // Minimum similarity score
  const LIMIT = 4;              // Top 3–4 courses

  //  Rank using cosine similarity + filter by threshold
  const rankedCourses = courses
    .map(course => ({
      course,
      score: cosineSimilarity(queryEmbedding, course.embedding),
    }))
    .filter(item => item.score >= THRESHOLD)          // remove weak matches
    .sort((a, b) => b.score - a.score)                // sort high → low
    .slice(0, LIMIT)                                   // top 3–4
    .map(item => item.course);                        // return course only

  return res.status(200).json({
    success: true,
    count: rankedCourses.length,
    courses: rankedCourses,
  });
});

