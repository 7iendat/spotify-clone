import { Router } from "express";
import { getAlbumId, getAllAlbums } from "../controller/album.controller.js";

const router = Router();

router.get("/", getAllAlbums);
router.get("/:albumId", getAlbumId);

export default router;
