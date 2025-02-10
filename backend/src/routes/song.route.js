import { Router } from "express";
import {
  getAllSongs,
  getFeaturedSongs,
  getMadeByYouSongs,
  getTrendingSongs,
} from "../controller/song.controller.js";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protectRoute, requireAdmin, getAllSongs);
router.get("/featured", getFeaturedSongs);
router.get("/made-by-you", getMadeByYouSongs);
router.get("/trending", getTrendingSongs);

export default router;
