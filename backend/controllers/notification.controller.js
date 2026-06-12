import { Notification }from "../models/Notification.js";

export const getNotifications =
async (req, res) => {

  try {

    const notifications =
      await Notification.find({
        recipient:
          req.user._id
      })
      .sort({
        createdAt: -1
      });

    res.status(200).json({
      success: true,
      notifications
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

export const markAsSeen =
async (req, res) => {
  try {
    const notification =
      await Notification.findByIdAndUpdate(
        req.params.id,
        {
          seen: true
        },
        {
          new: true
        }
      );

    res.status(200).json({
      success: true,
      notification
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};