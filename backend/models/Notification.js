import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: ["match", "accepted"],
      required: true,
      default: "match",
    },

    relatedRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Request",
    },

    relatedSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Notification = mongoose.model(
  "Notification",
  notificationSchema
);
