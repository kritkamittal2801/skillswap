import {Request} from "../models/Request.js";
import  {extractTopics} from"../services/aiService.js";
import {findMatches} from "../services/matchingService.js";
import { Notification } from "../models/Notification.js";
import {emitNotification} from "../socket/socketManager.js";
import { User } from "../models/User.js";

export const createRequest = async (req, res) => {
  try {
    const { description, subject, mode, coinAmount,barterOffer } = req.body;
    
    const user = await User.findById(req.user._id);

    if (!description || !subject || !mode) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
} 

if (mode === "paid" && !coinAmount) {
  return res.status(400).json({
    success: false,
    message:
      "Coin amount required",
  });
}

if (
  mode === "paid" &&
  user.coins < coinAmount
) {

  return res.status(400).json({
    success: false,
    message:
      "You do not have enough coins",
  });

}

if ( mode === "barter" && (!barterOffer)) {
  return res.status(400).json({
    success: false,
    message:
      "Exchange topics required",
  });
}

let exchangeTopics = [];

if (mode === "barter") {

  exchangeTopics =
    await extractTopics(
      barterOffer
    );

}

  const topics = await extractTopics(description);

    const request = await Request.create({
      requester: req.user._id,
      description,
      subject,
      mode,
      coinAmount,
      barterOffer,
      exchangeTopics,
      topics
    });

    
    const matches = await findMatches( request.topics,request.requester );
    console.log(matches);

    const modeText = mode === "paid" ? `${coinAmount} coins` : "barter";
    const matchMessage = `${user.username} posted a ${subject} request · ${modeText}`;

    for (const match of matches) {

      const notification =
        await Notification.create({
          recipient:
            match.user._id,

          message: matchMessage,

          type: "match",

          relatedRequest: request._id,
        });


      emitNotification(
        match.user._id.toString(),
        notification
      );


    }

    res.status(201).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
    .populate("requester", "username email")
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await Request.findById(
      req.params.id
    ).populate(
      "requester",
      "username email skillsOffered rating isOnline lastSeen"
    );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    res.status(200).json({
      success: true,
      request,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
