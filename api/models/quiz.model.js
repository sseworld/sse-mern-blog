import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["multiple-choice", "true-false", "open-ended"],
  },
  options: {
    type: [
      {
        _id: mongoose.Schema.Types.ObjectId,
        text: {
          type: String,
          required: true,
        },
        isCorrect: {
          type: Boolean,
          default: false,
        },
      },
    ],
    validate: {
      validator: (options) => {
        // Ensure at least one option is marked as correct for multiple-choice questions
        if (options.some((option) => option.isCorrect)) {
          return true;
        } else {
          return false;
        }
      },
      message:
        "At least one option must be marked as correct for multiple-choice questions.",
    },
  },
  answer: {
    type: String, // Change to array for multiple-correct answers
    validate: {
      validator: (answer, type) => {
        // Validate answer based on question type
        if (type === "multiple-choice") {
          // Optionally validate if answer matches an existing option ID
          const isValidOption = options.some(
            (option) => option._id.toString() === answer
          );
          return isValidOption;
        } else if (type === "true-false") {
          return answer === "true" || answer === "false";
        } else {
          // Open-ended answer, no validation needed
          return true;
        }
      },
      message: "Invalid answer provided for the given question type.",
    },
  },
});

const metadataSchema = new mongoose.Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const quizSchema = new mongoose.Schema({
  // _id: mongoose.Schema.Types.ObjectId,
  isBlog: {
    type: Boolean,
    default: false,
  },
  blogId: {
    type: String,
    default: null,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  duration: {
    type: Number,
    min: 0,
  },
  questions: {
    type: [questionSchema],
    required: true,
  },
  metadata: {
    type: metadataSchema,
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now,
  // },
  // createdBy: {
  //   type: String,
  // },
  // tags: {
  //   type: [String],
  // },
});

const Quiz = mongoose.model("Quiz", quizSchema);

export default Quiz;
