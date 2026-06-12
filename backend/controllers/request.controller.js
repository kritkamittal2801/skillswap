import {Request} from "../models/Request.js";
import  {extractTopics} from"../services/aiService.js";
import {findMatches} from "../services/matchingService.js";
import { Notification } from "../models/Notification.js";
import {emitNotification} from "../socket/socketManager.js";

export const createRequest = async (req, res) => {
  try {
    const { description, subject, mode, coinAmount } = req.body;

    if (!description || !subject || !mode) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
} 

  const topics = await extractTopics(description);

    const request = await Request.create({
      requester: req.user._id,
      description,
      subject,
      mode,
      coinAmount,
      topics
    });
    
    const matches = await findMatches( request.topics,request.requester );
    console.log(matches);
    
    for (const match of matches) {
      
  const notification =
    await Notification.create({
      recipient:
        match.user._id,

      message:
        "A new request matches your skills",
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
    .populate("requester", "name email")
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
      "name email skills learningSkills rating"
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
