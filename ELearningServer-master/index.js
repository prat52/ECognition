import express from "express";
import dotenv from "dotenv";
import { connectDb } from "./database/db.js";
import Razorpay from "razorpay";
import cors from "cors";
// import redisRoutes from "./routes/redisRoutes.js";
import redis from "./config/redis.js"

dotenv.config();

export const instance = new Razorpay({
  key_id: process.env.Razorpay_Key,
  key_secret: process.env.Razorpay_Secret,
});

const app = express();

// using middlewares
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Server is working");
});

app.use("/uploads", express.static("uploads"));

// importing routes
import userRoutes from "./routes/user.js";
import courseRoutes from "./routes/course.js";
import adminRoutes from "./routes/admin.js";
import redisRoutes from "./routes/redis.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";


// using routes
app.use("/api", userRoutes);
app.use("/api", courseRoutes);
app.use("/api", adminRoutes);
app.use("/", redisRoutes);
app.use("/api", recommendationRoutes);



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDb();
});





