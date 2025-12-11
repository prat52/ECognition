// import { createClient } from "redis";

// const redisClient = createClient({
//   url: "redis://localhost:6379",
// });

// redisClient.on("error", (err) => console.log("Redis Error:", err));

// await redisClient.connect();

// export default redisClient;
// backend/config/redis.js
import { createClient } from "redis";

const REDIS_URL = process.env.REDIS_URL || "redis://127.0.0.1:6379";

const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});
redisClient.on("connect", () => {
  console.log("Redis connected");
});

// connect immediately when this module is imported
// Note: top-level await is supported in Node 14+ with ESM; if your Node doesn't support, wrap connect in a function called from index.js
await redisClient.connect();

export default redisClient;
