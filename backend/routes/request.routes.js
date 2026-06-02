import express from "express";
import { createRequest,getAllRequests,getRequestById } from "../controllers/request.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createRequest);
router.get("/",getAllRequests);
router.get("/:id", getRequestById);

export default router;