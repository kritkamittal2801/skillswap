import {Request} from "../models/Request.js";

export const createRequest = async (req, res) => {
  try {
    const { description, subject, mode, coinAmount } = req.body;

    if (!description || !subject || !mode) {
  return res.status(400).json({
    success: false,
    message: "All fields are required",
  });
}

console.log("req.user:", req.user);
console.log("req.user.id:", req.user?._id); 
    const request = await Request.create({
      requester: req.user._id,
      description,
      subject,
      mode,
      coinAmount,
    });

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