import express from "express";
import {
  createQuiz,
  deleteQuiz,
  getQuiz,
  getUniqueQuiz,
  updateQuiz,
} from "../controllers/quiz.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createQuiz);
router.get("/getQuiz/:quizId", getUniqueQuiz);
router.get("/getQuiz", verifyToken, getQuiz);
router.delete("deleteQuiz/:quizId", verifyToken, deleteQuiz);
router.put("/updateQuiz/:quizId", updateQuiz);

export default router;
