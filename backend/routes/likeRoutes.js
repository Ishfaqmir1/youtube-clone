import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Video from "../models/Video.model.js";
import Comment from "../models/Comment.model.js";

const router = express.Router();

// Like a video
router.post("/video/:id/like", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (!video.likes.includes(req.user._id)) {
      video.likes.push(req.user._id);
      video.dislikes = video.dislikes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      await video.save();
    }

    res.json({ message: "Liked video" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dislike a video
router.post("/video/:id/dislike", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (!video.dislikes.includes(req.user._id)) {
      video.dislikes.push(req.user._id);
      video.likes = video.likes.filter(
        (id) => id.toString() !== req.user._id.toString()
      );
      await video.save();
    }

    res.json({ message: "Disliked video" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Like a comment
router.post("/comment/:id/like", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (!comment.likes.includes(req.user._id)) {
      comment.likes.push(req.user._id);
      await comment.save();
    }

    res.json({ message: "Liked comment" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
