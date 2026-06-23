import { Rating } from "../models/Rating.js";
import { User } from "../models/User.js";
import { Session } from "../models/Session.js";

export const createRating = async (req, res) => {
  try {
    const { stars, review } = req.body;

    const session = await Session.findById(req.params.sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    const reviewee = session.helper;

    const existingRating = await Rating.findOne({
      session: session._id,

      reviewer: req.user._id,
    });

    if (existingRating) {
      return res.status(400).json({
        success: false,
        message: "You have already rated this session",
      });
    }

    const rating = await Rating.create({
      session: session._id,

      reviewer: req.user._id,

      reviewee,

      stars,

      review,
    });

    const ratings = await Rating.find({
      reviewee,
    });

    const total = ratings.reduce((sum, rating) => sum + rating.stars, 0);

    const average = total / ratings.length;

    await User.findByIdAndUpdate(reviewee, {
      rating: average,

      ratingCount: ratings.length,
    });

    res.status(201).json({
      success: true,
      rating,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const checkRating =
async (req, res) => {

  const rating =
    await Rating.findOne({

      session:
        req.params.sessionId,

      reviewer:
        req.user._id,

    });

  res.status(200).json({

    success: true,

    alreadyRated:
      !!rating,

  });

};