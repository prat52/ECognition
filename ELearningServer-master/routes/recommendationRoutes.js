

import express from "express";
import { getRecommendedCourses } from "../services/recommendationService.js";
import { isAuth } from "../middlewares/isAuth.js";

const router = express.Router();


router.get("/recommended", isAuth, async (req, res) => {
  try {
    const userId = req.user._id;  //  FROM TOKEN

    const recommended = await getRecommendedCourses(userId);

    res.status(200).json({
      success: true,
      recommended,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});


export default router;
