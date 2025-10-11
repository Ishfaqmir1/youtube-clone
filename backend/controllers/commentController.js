// backend/controllers/commentController.js
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

//  Add Comment
export const addComment = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    if (!text?.trim()) {
      return res.status(400).json({ error: "Comment text is required." });
    }

    const comment = await Comment.create({
      user: userId,
      video: videoId,
      text,
    });

    await Video.findByIdAndUpdate(videoId, { $push: { comments: comment._id } });

    const updatedVideo = await Video.findById(videoId)
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      })
      .populate("channel", "channelName");

    res.status(201).json(updatedVideo);
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Server error adding comment." });
  }
};

// Edit Comment
export const editComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found." });
    if (comment.user.toString() !== userId)
      return res.status(403).json({ error: "Not authorized." });

    comment.text = text;
    await comment.save();

    const video = await Video.findById(comment.video)
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      })
      .populate("channel", "channelName");

    res.json(video);
  } catch (err) {
    console.error("Error editing comment:", err);
    res.status(500).json({ error: "Server error editing comment." });
  }
};

// Delete Comment
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found." });
    if (comment.user.toString() !== userId)
      return res.status(403).json({ error: "Not authorized." });

    await Comment.findByIdAndDelete(id);
    await Video.findByIdAndUpdate(comment.video, {
      $pull: { comments: id },
    });

    const video = await Video.findById(comment.video)
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      })
      .populate("channel", "channelName");

    res.json(video);
  } catch (err) {
    console.error("Error deleting comment:", err);
    res.status(500).json({ error: "Server error deleting comment." });
  }
};

// Like Comment
export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found." });

    if (!comment.likes.includes(userId)) {
      comment.likes.push(userId);
      comment.dislikes = comment.dislikes.filter(
        (d) => d.toString() !== userId
      );
    } else {
      comment.likes = comment.likes.filter((l) => l.toString() !== userId);
    }

    await comment.save();

    const video = await Video.findById(comment.video)
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      })
      .populate("channel", "channelName");

    res.json(video);
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ error: "Server error liking comment." });
  }
};

// Dislike Comment
export const dislikeComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).json({ error: "Comment not found." });

    if (!comment.dislikes.includes(userId)) {
      comment.dislikes.push(userId);
      comment.likes = comment.likes.filter((l) => l.toString() !== userId);
    } else {
      comment.dislikes = comment.dislikes.filter(
        (d) => d.toString() !== userId
      );
    }

    await comment.save();

    const video = await Video.findById(comment.video)
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      })
      .populate("channel", "channelName");

    res.json(video);
  } catch (err) {
    console.error("Error disliking comment:", err);
    res.status(500).json({ error: "Server error disliking comment." });
  }
};
