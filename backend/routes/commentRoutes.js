import express from "express";
import Comment from "../models/Comment.model.js";// NEW
import Video from "../models/Video.model.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

//  return updated video with populated channel + comments
const getUpdatedVideo = async (videoId) => {
  return await Video.findById(videoId)
    .populate("channel", "channelName handle avatar")
    .populate({
      path: "comments",
      populate: { path: "user", select: "username avatar" },
    });
};

//  Add Comment
router.post("/:videoId", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "Comment text is required" });

    const comment = new Comment({
      video: req.params.videoId,
      user: req.user._id,
      text,
    });
    await comment.save();

    await Video.findByIdAndUpdate(req.params.videoId, {
      $push: { comments: comment._id },
    });

    //  Return updated video with comments populated
    const updatedVideo = await Video.findById(req.params.videoId)
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      })
      .populate("channel", "channelName handle avatar");

    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


//  Edit Comment
router.put("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    comment.text = req.body.text || comment.text;
    await comment.save();

    const updatedVideo = await getUpdatedVideo(comment.video);
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Delete Comment
router.delete("/:id", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await comment.deleteOne();
    await Video.findByIdAndUpdate(comment.video, {
      $pull: { comments: comment._id },
    });

    const updatedVideo = await getUpdatedVideo(comment.video);
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Like Comment
router.post("/:id/like", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (!comment.likes.includes(req.user._id)) {
      comment.likes.push(req.user._id);
      comment.dislikes = comment.dislikes.filter(
        (u) => u.toString() !== req.user._id.toString()
      );
    }
    await comment.save();

    const updatedVideo = await getUpdatedVideo(comment.video);
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//  Dislike Comment
router.post("/:id/dislike", protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    if (!comment.dislikes.includes(req.user._id)) {
      comment.dislikes.push(req.user._id);
      comment.likes = comment.likes.filter(
        (u) => u.toString() !== req.user._id.toString()
      );
    }
    await comment.save();

    const updatedVideo = await getUpdatedVideo(comment.video);
    res.json(updatedVideo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
