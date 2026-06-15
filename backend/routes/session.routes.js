import express from "express";

import verifyJWT
from "../middleware/auth.middleware.js";

import {acceptRequest}from "../controllers/session.controller.js";
import { getSession } from "../controllers/session.controller.js";
import { startSession } from "../controllers/session.controller.js";

const router =
  express.Router();

router.post(
  "/accept/:id",
  verifyJWT,
  acceptRequest
);

router.get(
  "/:id",
  verifyJWT,
  getSession
);

router.put(
  "/start/:id",
  verifyJWT,
  startSession
);
export default router;