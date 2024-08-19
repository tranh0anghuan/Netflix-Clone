import express from "express";
import {
  addSearchHistory,
  getSearchHistory,
  removeItemFromSearchHistory,
  search,
} from "../controllers/search.controller.js";

const router = express.Router();

router.get("/:type/:query", search);

router.get("/history", getSearchHistory);
router.get("/history/:type/:id", addSearchHistory);
router.delete("/history/:id", removeItemFromSearchHistory);

export default router;
