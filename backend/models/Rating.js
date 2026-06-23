import mongoose from "mongoose";

const ratingSchema =
new mongoose.Schema(
{
  session: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "Session",
    required: true,
  },

  reviewer: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  reviewee: {
    type:
      mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  review: {
    type: String,
  },
},
{
  timestamps: true,
}
);

export const Rating =
mongoose.model(
  "Rating",
  ratingSchema
);