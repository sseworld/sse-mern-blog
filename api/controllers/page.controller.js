import Page from "../models/page.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Please provide all required fields"));
  }

  let slug;
  let stat;

  if (req.body.slug) {
    slug = req.body.slug;
  } else {
    slug = req.body.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");
  }

  if (req.body.status) {
    stat = req.body.status;
  } else {
    stat = "inactive";
  }

  //   const slug =
  //     req.body.title
  //       .split(" ")
  //       .join("-")
  //       .toLowerCase()
  //       .replace(/[^a-zA-Z0-9-]/g, "") || req.body.slug;
  const newPage = new Page({
    content: req.body.content,
    title: req.body.title,
    status: stat,
    slug,
  });
  try {
    const savedPage = await newPage.save();
    res.status(201).json(savedPage);
  } catch (error) {
    next(error);
  }
};

export const getpages = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const pages = await Page.find({
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.pagetId && { _id: req.query.pagetId }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPages = await Page.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPages = await Page.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      pages,
      totalPages,
      lastMonthPages,
    });
  } catch (error) {
    next(error);
  }
};

export const deletepage = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete this page"));
  }
  try {
    await Page.findByIdAndDelete(req.params.pageId);
    res.status(200).json("The Page has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatePage = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatedPage = await Page.findByIdAndUpdate(
      req.params.pageId,
      {
        $set: {
          content: req.body.content,
          title: req.body.title,
          status: req.body.status,
          slug: req.body.slug,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPage);
  } catch (error) {
    next(error);
  }
};
