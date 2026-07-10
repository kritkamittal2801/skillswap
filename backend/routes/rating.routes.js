import express from "express";

import verifyJWT from "../middleware/auth.middleware.js";

import { createRating } from "../controllers/rating.controller.js";
import { checkRating } from "../controllers/rating.controller.js";
import { getFeedbackHighlights } from "../controllers/rating.controller.js";
const router = express.Router();

router.post("/:sessionId", verifyJWT, createRating);
router.get("/check/:sessionId", verifyJWT, checkRating);
router.get("/highlights",getFeedbackHighlights);
export default router;
