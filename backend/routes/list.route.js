import express from "express";
import { addList, getList, removeItemFromList } from "../controllers/list.controller.js";


const router = express.Router();

router.get("/getList", getList);
router.get("/addList/:type/:id", addList);
router.delete("/:id", removeItemFromList);

export default router;
