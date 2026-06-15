import { Request } from "../models/Request.js";
import { Session } from "../models/Session.js";
import generateMeetLink from "../utils/generateMeetLink.js";
import { getIo } from "../socket/socketManager.js";
import {User} from "../models/User.js";

export const acceptRequest =
async (req, res) => {

  try {

    const request =
      await Request.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message:
          "Request not found",
      });
    }

    if (
      request.status ===
      "accepted"
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Already accepted",
      });
    }

    const meetLink =
      generateMeetLink();

      console.log("Request document:", request);
console.log("request.coinAmount:", request.coinAmount);

    const session =
      await Session.create({

        request:
          request._id,

        learner:
          request.requester,

        helper:
          req.user._id,
        coinAmount: request.coinAmount,


        meetLink,
        
      });

    request.status =
      "accepted";

    await request.save();

    res.status(201).json({
      success: true,
      session,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }
};

export const getSession =
async (req,res) => {

  const session =
    await Session.findById(
      req.params.id
    )
    .populate(
      "learner helper"
    );

  res.json({
    success:true,
    session
  });
};

export const startSession =
async (req, res) => {

  try {

    const session =
      await Session.findById(
        req.params.id
      ).populate("learner helper");

    if (!session) {

      return res.status(404).json({
        success: false,
        message:
          "Session not found"
      });

    }

    session.status =
      "active";

    await session.save();

 const io = getIo();

    io.emit(
  "sessionStarted",
  {
    sessionId:
      session._id
  }
);

    res.status(200).json({
      success: true,
      session
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message
    });

  }

};

export const completeSession=async(req,res)=>{
    const session =
  await Session.findById(
    req.params.id
  );

  if (!session) {
  return res.status(404).json({
    success: false,
    message:
      "Session not found"
  });
}

const learner =
  await User.findById(
    session.learner
  );

const helper =
  await User.findById(
    session.helper
  );

  if (
  learner.coins <
  session.coinAmount
) {
  return res.status(400).json({
    success: false,
    message:
      "Not enough coins"
  });
}
console.log(session);
console.log("learner has coins:",learner.coins);
console.log("helper has coins:",helper.coins);
console.log("session coins are:",session.coinAmount);

learner.coins-=
  session.coinAmount;

  helper.coins +=
  session.coinAmount;

  session.status =
  "completed";

  await learner.save();

await helper.save();

await session.save();

res.status(200).json({
  success: true,
  message:
    "Session completed"
});
}