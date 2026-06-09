import { User } from "../models/User.js";
import { expandSkills } from "../services/aiService.js";

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id).select(" -password -skillTags");

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const updateProfile = async (req, res) => {
    try {

      const { skillsOffered } = req.body;

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }


      // Generate hidden tags
      const skillTags =
        await expandSkills(
          skillsOffered
        );

      user.skillsOffered =
        skillsOffered;

      user.skillTags =
        skillTags;

      await user.save();

      res.status(200).json({
        success: true,
        message:
          "Profile updated successfully",
      });

    } catch (error) {
        console.error("PROFILE UPDATE ERROR:");
      res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  };

export {
    getProfile,
    updateProfile
};