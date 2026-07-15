import { User } from "../models/User.js";
import { Session } from "../models/Session.js";
import { Request } from "../models/Request.js"; 

export const getRecentActivity = async (req, res) => {
  try {
    const sessions = await Session.find({})
      .sort({ updatedAt: -1 })
      .limit(8)
      .populate("helper", "username")
      .populate("request", "subject mode "); // use whatever field name your Request model actually has

    const statusMap = {
      scheduled: "matched",
      active: "live",
      completed: "solved",
      cancelled: null, // we'll filter these out
    };

    const feed = sessions
      .filter((s) => statusMap[s.status])
      .map((s) => ({
        name: s.helper?.username || "Someone",
        subject: s.request?.subject || s.request?.title || "a doubt",
        status: statusMap[s.status],
        time: timeAgo(s.updatedAt),
      }));

    res.json({ feed });
  } catch (err) {
    res.status(500).json({ message: "Failed to load activity", error: err.message });
  }
};

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? "s" : ""} ago`;
}

export const getHomepageStats = async (req, res) => {
  try {
    const activeStudents = await User.countDocuments();
    const onlineNow = await User.countDocuments({ isOnline: true });

    const ratingAgg = await User.aggregate([
      { $match: { ratingCount: { $gt: 0 } } },
      { $group: { _id: null, avgRating: { $avg: "$rating" }, totalRatings: { $sum: "$ratingCount" } } },
    ]);
    const averageRating = ratingAgg[0]?.avgRating?.toFixed(1) || "0.0";
    const totalRatings = ratingAgg[0]?.totalRatings || 0;

    const distinctSkills = await User.distinct("skillTags");
    const topicsCovered = distinctSkills.length;

    const completedSessions = await Session.countDocuments({ status: "completed" });

    res.json({ activeStudents, onlineNow, averageRating, totalRatings, topicsCovered, completedSessions });
  } catch (err) {
    res.status(500).json({ message: "Failed to load stats", error: err.message });
  }
};

export const getTopHelpers = async (req, res) => {
  try {
    const helpers = await User.find({ ratingCount: { $gte: 1 } })
      .sort({ rating: -1, ratingCount: -1 })
      .limit(5)
      .select("username rating ratingCount skillsOffered");
    res.json({ helpers });
  } catch (err) {
    res.status(500).json({ message: "Failed to load top helpers", error: err.message });
  }
};