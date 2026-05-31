import { User } from "../models/User.js";

const getProfile = async (req, res) => {

    try {

        const user = await User.findById(req.user._id);

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

        const updatedUser =
            await User.findByIdAndUpdate(
                req.user._id,
                {
                    skillsOffered
                },
                {
                    new: true
                }
            );

        res.status(200).json(updatedUser);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

export {
    getProfile,
    updateProfile
};