import express from "express";

import verifyJWT
from "../middleware/auth.middleware.js";

import {acceptRequest}from "../controllers/session.controller.js";
import { getSession } from "../controllers/session.controller.js";
import { startSession } from "../controllers/session.controller.js";
import { completeSession } from "../controllers/session.controller.js";
import { confirmSession } from "../controllers/session.controller.js";
import { joinSession } from "../controllers/session.controller.js";
import { getMySessions } from "../controllers/session.controller.js";

const router =
  express.Router();

router.get(
  "/",
  verifyJWT,
  getMySessions
);

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

router.put(
  "/complete/:id",
  verifyJWT,
  completeSession
);

router.put("/:id/confirm",verifyJWT,confirmSession);

// New primary action behind the "Join meeting" button.
router.put("/join/:id", verifyJWT, joinSession);

export default router;
