import { Router } from "express";
import { getHomepageStats, getTopHelpers,getRecentActivity } from "../controllers/stats.controller.js";


const router = Router();
router.get("/homepage", getHomepageStats);
router.get("/top-helpers", getTopHelpers);
router.get("/recent-activity", getRecentActivity);
export default router;