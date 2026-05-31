import express from "express";
import {getProfile,updateProfile } from "../controllers/user.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
const router = express.Router();

router.get(
    "/profile",
    verifyJWT,
    getProfile
);

router.put(
    "/profile",
    verifyJWT,
    updateProfile
);
export default router;