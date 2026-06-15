import mongoose from "mongoose";

const sessionSchema =
new mongoose.Schema(
  {
    request: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
      required: true,
    },

    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    helper: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    meetLink: {
      type: String,
      required: true,
    },
    coinAmount: {
        type: Number,
        required: true
        },

    status: {
      type: String,
      enum: [
        "scheduled",
        "completed",
        "cancelled",
        "active"
      ],
      default: "scheduled",
    },
  },
  {
    timestamps: true,
  }
);

export const Session =
  mongoose.model(
    "Session",
    sessionSchema
  );