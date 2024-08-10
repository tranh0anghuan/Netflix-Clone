import express from "express";
import {
  getSimilarTV,
  getTrendingTV,
  getTVByCategory,
  getTVDetails,
  getTVTrailers,
} from "../controllers/tv.controller.js";

const router = express.Router();

router.get("/trending", getTrendingTV);
router.get("/:id/trailers", getTVTrailers);
router.get("/:id/details", getTVDetails);
router.get("/:id/similar", getSimilarTV);
router.get("/:category", getTVByCategory);

export default router;
