import express from "express";
import { authCheck, login, logout, sigup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

router.post("/signup", sigup);
router.post("/login", login);
router.post("/logout", logout);

router.get("/authCheck", protectRoute, authCheck);

export default router;
