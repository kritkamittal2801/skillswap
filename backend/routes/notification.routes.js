import express from "express";

import {
  getNotifications,
  markAsRead
}
from "../controllers/notification.controller.js";

import  verifyJWT
from "../middleware/auth.middleware.js";

const router = express.Router();

router.get(
  "/",
  verifyJWT,
  getNotifications
);

router.put(
  "/:id/read",
  verifyJWT,
  markAsRead
);

export default router;
