import express from "express";
import {
  getVideos,
  getVideoById,
  addVideo,
  updateVideo,
  deleteVideo,
  likeVideo,
  dislikeVideo,
  addComment,
  deleteComment,
} from "../controllers/videoController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Video routes
router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/", protect, addVideo);
router.put("/:id", protect, updateVideo);
router.delete("/:id", protect, deleteVideo);

// Likes/Dislikes
router.post("/:id/like", protect, likeVideo);
router.post("/:id/dislike", protect, dislikeVideo);

// Comments
router.post("/:id/comments", protect, addComment);
router.delete("/:id/comments/:commentId", protect, deleteComment);

export default router;
