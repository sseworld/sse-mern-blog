import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    status: {
      type: String,
      required: true,
      default: "inactive",
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Page", pageSchema);

export default Post;
