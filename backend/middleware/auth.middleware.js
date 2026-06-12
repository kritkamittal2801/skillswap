import jwt from "jsonwebtoken";

const verifyJWT = async (req, res, next) => {

  const authHeader =
    req.header("Authorization");

  console.log(
    "Auth Header:",
    authHeader
  );

  try {

    const token =
      authHeader?.replace(
        "Bearer ",
        ""
      );

    console.log(
      "Extracted Token:",
      token
    );

    if (!token) {
      return res.status(401).json({
        message:
          "Unauthorized request"
      });
    }

    const decodedToken =
      jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET
      );

    console.log(
      "Decoded Token:",
      decodedToken
    );

    req.user = decodedToken;

    next();

  } catch (error) {

    console.log(
      "JWT Error:",
      error.message
    );

    return res.status(401).json({
      message: "Invalid token"
    });

  }
};

export default verifyJWT;