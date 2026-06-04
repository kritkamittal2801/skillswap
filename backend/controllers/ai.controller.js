import {extractTopics} from "../services/aiService.js";

export const extractTopicsController =
  async (req, res) => {
    try {
      const { text } = req.body;

      const topics = await extractTopics(text);

      res.status(200).json({
        success: true,
        topics,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };