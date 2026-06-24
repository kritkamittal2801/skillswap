import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import { Rating } from "../models/Rating.js";

export const getDashboard = async (req, res) => {
  const user = await User.findById(req.user._id);

  const ratings = await Rating.find({
    reviewee: req.user._id,
  });

  const averageRating =
    ratings.length > 0
      ? ratings.reduce(
          (sum, rating) => sum + rating.stars,

          0,
        ) / ratings.length
      : 0;

  const totalReviews = ratings.length;

  const sessions = await Session.find({
    status: "completed",

    $or: [
      {
        learner: req.user._id,
      },

      {
        helper: req.user._id,
      },
    ],
  }).populate("request");

  const sessionsCompleted = sessions.length;

  const skillsLearned = sessions.filter(
    (session) => session.learner.toString() === req.user._id,
  ).length;

  const skillsTaught = sessions.filter(
    (session) => session.helper.toString() === req.user._id,
  ).length;

  const coinsEarned = sessions

    .filter((session) => session.helper.toString() === req.user._id)

    .reduce(
      (sum, session) => sum + session.coinAmount,

      0,
    );

  const coinsSpent = sessions

    .filter((session) => session.learner.toString() === req.user._id)

    .reduce(
      (sum, session) => sum + session.coinAmount,

      0,
    );

  let paidSessions = 0;

  let barterSessions = 0;

  sessions.forEach((session) => {
    if (session.request?.mode === "paid") {
      paidSessions++;
    }

    if (session.request?.mode === "barter") {
      barterSessions++;
    }
  });

  const skillsCanTeach = user.skillsOffered || [];

  const skillMap = {};
  sessions.forEach((session) => {
    const subject = session.request?.subject;

    if (!subject) return;

    skillMap[subject] = (skillMap[subject] || 0) + 1;
  });

  const mostExchangedSkills = Object.entries(skillMap)

    .sort((a, b) => b[1] - a[1])

    .slice(0, 3)

    .map((item) => item[0]);

  const recentSessions = await Session.find({
    $or: [
      {
        learner: req.user._id,
      },
      {
        helper: req.user._id,
      },
    ],
  })

    .populate("request")

    .sort({
      createdAt: -1,
    })

    .limit(5);

  return res.json({
    success: true,

    stats: {
      coins: user.coins,

      averageRating,

      totalReviews,

      skillsLearned,

      skillsTaught,

      sessionsCompleted,

      coinsEarned,

      coinsSpent,

      paidSessions,

      barterSessions,

      skillsCanTeach,

      mostExchangedSkills,
    },

    recentSessions,
  });
};
