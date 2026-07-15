import { Request } from "../models/Request.js";
import { Session } from "../models/Session.js";
import generateMeetLink from "../utils/generateMeetLink.js";
import { getIo, emitNotification } from "../socket/socketManager.js";
import { User } from "../models/User.js";
import { Notification } from "../models/Notification.js";

const MIN_SESSION_SECONDS = 5 * 60;

export const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    if (request.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Already accepted",
      });
    }

    const learner = await User.findById(request.requester);

    if (request.mode === "paid" && learner.coins < request.coinAmount) {
      return res.status(400).json({
        success: false,
        message: "Learner does not have enough coins",
      });
    }

    const meetLink = generateMeetLink();

    const session = await Session.create({
      request: request._id,

      learner: request.requester,

      helper: req.user._id,
      coinAmount: request.mode === "paid" ? request.coinAmount : 0,

      meetLink,
    });

    request.status = "accepted";

    await request.save();

    const acceptMessage = `${req.user.username} accepted your ${request.subject} request`;

    const notification = await Notification.create({
      recipient: request.requester,
      message: acceptMessage,
      type: "accepted",
      relatedSession: session._id,
    });

    emitNotification(request.requester.toString(), notification);

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.log("ACCEPT REQUEST ERROR:");
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSession = async (req, res) => {
  const session = await Session.findById(req.params.id)
    .populate("learner helper")
    .populate("request");

  res.json({
    success: true,
    session,
    minSessionSeconds: MIN_SESSION_SECONDS,
  });
};

export const startSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate(
      "learner helper",
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    session.status = "active";
    session.startedAt = new Date();

    await session.save();

    const io = getIo();

    io.emit("sessionStarted", {
      sessionId: session._id,
      startedAt: session.startedAt,
    });

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const completeSession = async (req, res) => {
  const session = await Session.findById(req.params.id);

  if (!session) {
    return res.status(404).json({
      success: false,
      message: "Session not found",
    });
  }

  const learner = await User.findById(session.learner);

  const helper = await User.findById(session.helper);

  if (learner.coins < session.coinAmount) {
    return res.status(400).json({
      success: false,
      message: "Not enough coins",
    });
  }

  learner.coins -= session.coinAmount;

  helper.coins += session.coinAmount;

  session.status = "completed";

  await learner.save();

  await helper.save();

  await session.save();

  res.status(200).json({
    success: true,
    message: "Session completed",
  });
};

export const confirmSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id).populate("request");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.learner.toString() === req.user._id) {
      session.learnerConfirmed = true;
    }

    if (session.helper.toString() === req.user._id) {
      session.helperConfirmed = true;
    }

    if (session.learnerConfirmed && session.helperConfirmed) {
      if (session.coinAmount > 0) {
        const learner = await User.findById(session.learner);

        const helper = await User.findById(session.helper);

        learner.coins -= session.coinAmount;

        helper.coins += session.coinAmount;

        await learner.save();

        await helper.save();
      }

      session.status = "completed";
    }

    await session.save();

    const io = getIo();

    const updatedSession = await Session.findById(session._id)
      .populate("learner helper")
      .populate("request");

    io.emit("sessionUpdated", updatedSession);

    res.status(200).json({
      success: true,
      session: updatedSession,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const joinSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("learner helper")
      .populate("request");

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      });
    }

    if (session.learner._id.toString() === req.user._id) {
      session.learnerJoined = true;
    }

    if (session.helper._id.toString() === req.user._id) {
      session.helperJoined = true;
    }

    const bothJoined = session.learnerJoined && session.helperJoined;
    const elapsedMs = session.startedAt
      ? Date.now() - new Date(session.startedAt).getTime()
      : 0;
    const minimumElapsed = elapsedMs >= MIN_SESSION_SECONDS * 1000;

    if (bothJoined && minimumElapsed && session.status !== "completed") {
      if (session.coinAmount > 0) {
        const learner = await User.findById(session.learner._id);
        const helper = await User.findById(session.helper._id);

        learner.coins -= session.coinAmount;
        helper.coins += session.coinAmount;

        await learner.save();
        await helper.save();
      }

      session.status = "completed";
    }

    await session.save();

    const io = getIo();

    const updatedSession = await Session.findById(session._id)
      .populate("learner helper")
      .populate("request");

    io.emit("sessionUpdated", updatedSession);

    res.status(200).json({
      success: true,
      session: updatedSession,
      bothJoined,
      minimumElapsed,
      secondsRemaining: minimumElapsed
        ? 0
        : Math.max(0, MIN_SESSION_SECONDS - Math.floor(elapsedMs / 1000)),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getMySessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      $or: [{ learner: req.user._id }, { helper: req.user._id }],
    })
      .populate("learner helper", "username")
      .populate("request")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
