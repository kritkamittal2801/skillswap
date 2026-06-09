import {User} from "../models/User.js";

export const calculateMatchScore =
(
  requestTopics,
  userTags
) => {

  let score = 0;

  const normalizedTags =
    userTags.map(tag =>
      tag.toLowerCase().trim()
    );

  requestTopics.forEach(topic => {

    if (
      normalizedTags.includes(
        topic.toLowerCase().trim()
      )
    ) {
      score++;
    }

  });

  return score;
};

export const findMatches = async (
  topics,requesterId
) => {
  const users = await User.find({
  _id: { $ne: requesterId }
});

  const matches = [];

  users.forEach((user) => {
    const score =
      calculateMatchScore(
        topics,
        user.skillsOffered
      );

    if (score > 0) {
      matches.push({
        user,
        score,
      });
    }
  });

  matches.sort(
    (a, b) => b.score - a.score
  );

  return matches;
};