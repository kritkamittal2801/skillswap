import express from "express";
import { createRequest } from "../controllers/request.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createRequest);

export default router;