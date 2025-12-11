import express from "express";
const app = express.Router();
import redis from "../config/redis.js";

app.get("/test-redis", async (req, res) => {
  await redis.set("hello", "world");
  const val = await redis.get("hello");
  res.json({ val });
});
export default app;