import { User } from "../models/User.js";


// SIGNUP CONTROLLER
const signup = async (req, res) => {

    try {

        const { username, email, password , college , year } = req.body;

        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        const user = await User.create({
            username,
            email,
            password,
            college,
            year
        });

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(201).json({
            message: "User created successfully",
            user
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });
    }
};


const login = async (req, res) => {

    try {

        const { email, password } = req.body;


        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }


        // CHECK PASSWORD
        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }


        const accessToken = user.generateAccessToken();

        const userResponse = user.toObject();
        delete userResponse.password;

        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user
        });

    } catch (error) {

        return res.status(500).json({
            message: error.message
        });
    }
};


export {
    signup,
    login
};