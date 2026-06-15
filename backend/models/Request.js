import mongoose,{Schema} from "mongoose";

const requestSchema = new Schema(
  {
    requester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    mode: {
      type: String,
      enum: ["paid", "barter"],
      required: true,
    },

    coinAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "open",
    },
    topics:{
      type:[String],
      default:[],
    },
    status: {
      type: String,
      enum: [
        "open",
        "accepted",
        "completed"
      ],
      default: "open"
},
  },
  { timestamps: true }
);

export const Request= mongoose.model("Request", requestSchema);