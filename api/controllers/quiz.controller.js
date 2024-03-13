import Quiz from "../models/quiz.model.js";
import { errorHandler } from "../utils/error.js";

export const createQuiz = async (req, res, next) => {
  // return res.status(200).json(console.log(Quiz));
  try {
    const { isBlog, name, description, duration, questions, metadata } =
      req.body;
    if (!req.user.isAdmin) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    if (isBlog === true) {
      if (!req.body.blogId) {
        return res.status(401).json("Please enter the blog Id");
      } else {
        const newQuiz = new Quiz({
          isBlog: isBlog,
          name: name,
          blogId: req.body.blogId,
          description,
          duration,
          questions,
          metadata,
        });
        await newQuiz.save();
        res.status(200).json(newQuiz);
      }
    } else {
      const newQuiz = new Quiz({
        isBlog: isBlog,
        name: name,
        description,
        duration,
        questions,
        metadata,
      });
      await newQuiz.save();
      res.status(200).json(newQuiz);
    }

    // const newQuiz = new Quiz({
    //   isBlog: isBlog,
    //   name: name,
    //   description,
    //   duration,
    //   questions,
    //   metadata,
    // });
  } catch (error) {
    next(error);
  }
};

export const getQuiz = async (req, res, next) => {
  if (!req.user.isAdmin)
    return next(errorHandler(403, "You are not allowed to get all comments"));
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.sort === "desc" ? -1 : 1;

    const quizes = await Quiz.find()
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalQuiz = await Quiz.countDocuments();
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    const lastMonthQuiz = await Quiz.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({ quizes, totalQuiz, lastMonthQuiz });
  } catch (error) {
    next(error);
  }
};

export const getUniqueQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    res.status(200).json(quiz);
  } catch (error) {
    next(error);
  }
};

export const updateQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return next(errorHandler(404, "Quiz not found"));
    }
    // if (!req.user.isAdmin) {
    //   return next(
    //     errorHandler(403, "You are not allowed to create this comment")
    //   );
    // }

    if (req.body.isBlog === true) {
      if (!req.body.blogId) {
        return res.status(401).json("Please enter the blog Id");
      } else {
        const { isBlog, name, description, duration, questions, metadata } =
          req.body;
        const updateQuiz = await Quiz.findByIdAndUpdate(
          req.params.quizId,
          {
            isBlog: isBlog,
            name: name,
            blogId: req.body.blogId,
            description,
            duration,
            questions,
            metadata,
          },
          { new: true }
        );
        res.status(200).json(updateQuiz);
      }
    } else {
      const { isBlog, name, description, duration, questions, metadata } =
        req.body;
      const updateQuiz = await Quiz.findByIdAndUpdate(
        req.params.quizId,
        {
          isBlog: isBlog,
          name: name,
          blogId: null,
          description,
          duration,
          questions,
          metadata,
        },
        { new: true }
      );
      res.status(200).json(updateQuiz);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return next(errorHandler(44, "Quiz not found"));
    }
    if (!req.user.isAdmin) {
      return next(errorHandler(403, "You are not allowed to delete this quiz"));
    }
    await Quiz.findByIdAndDelete(req.params.quizId);
    res.status(200).json("Quiz deleted successfully");
  } catch (error) {
    next(error);
  }
};
