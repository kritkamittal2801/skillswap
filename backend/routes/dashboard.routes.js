import express from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import { getDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", verifyJWT, getDashboard);

export default router;
