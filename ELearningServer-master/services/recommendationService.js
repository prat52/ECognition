
import { Courses } from "../models/Courses.js";
import { User } from "../models/User.js";

const cosineSimilarity = (a, b) => {
  let dot = 0.0, normA = 0.0, normB = 0.0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
};

export const getRecommendedCourses = async (userId) => {
  const user = await User.findById(userId);

  if (!user || user.subscription.length === 0) return [];

  //  Purchased courses
  const purchased = await Courses.find({
    _id: { $in: user.subscription },
  });

  //  Candidate courses
  const candidates = await Courses.find({
    _id: { $nin: user.subscription },
    embedding: { $exists: true },
  });

  const THRESHOLD = 0.6;

  const scored = candidates.map(course => {
    let score = 0;

    purchased.forEach(p => {
      score += cosineSimilarity(p.embedding, course.embedding);
    });

    return { course, score };
  });

  return scored
    .filter(item => item.score >= THRESHOLD)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .map(item => item.course);
};

