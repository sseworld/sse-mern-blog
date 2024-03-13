import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  deletepage,
  getpages,
  updatePage,
} from "../controllers/page.controller.js";

const router = express.Router();

router.post("/create", verifyToken, create);
router.get("/getpages", getpages);
router.delete("/deletepage/:pageId", verifyToken, deletepage);
router.put("/updatepage/:pageId", verifyToken, updatePage);

export default router;
