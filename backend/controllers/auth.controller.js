import { User } from "../models/User.js";


// SIGNUP CONTROLLER
const signup = async (req, res) => {

    try {

        const { username, email, password } = req.body;


        // CHECK IF USER EXISTS
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }


        // CREATE USER
        const user = await User.create({
            username,
            email,
            password
        });


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



// LOGIN CONTROLLER
const login = async (req, res) => {

    try {

        const { email, password } = req.body;


        // FIND USER
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


        // GENERATE TOKEN
        const accessToken = user.generateAccessToken();


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