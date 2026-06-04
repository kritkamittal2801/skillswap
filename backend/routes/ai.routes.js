import express from "express";

import { extractTopicsController } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/extract-topics",extractTopicsController );

export default router;