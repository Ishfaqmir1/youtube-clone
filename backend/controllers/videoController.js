// backend/controllers/videoController.js
import Video from "../models/Video.model.js";

export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Remove dislike if exists
    video.dislikes = video.dislikes.filter(
      (uid) => uid.toString() !== req.user.id
    );

    // Toggle like
    if (video.likes.includes(req.user.id)) {
      video.likes = video.likes.filter((uid) => uid.toString() !== req.user.id);
    } else {
      video.likes.push(req.user.id);
    }

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Remove like if exists
    video.likes = video.likes.filter(
      (uid) => uid.toString() !== req.user.id
    );

    // Toggle dislike
    if (video.dislikes.includes(req.user.id)) {
      video.dislikes = video.dislikes.filter(
        (uid) => uid.toString() !== req.user.id
      );
    } else {
      video.dislikes.push(req.user.id);
    }

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    const newComment = { text: req.body.text, user: req.user.id };
    video.comments.push(newComment);

    await video.save();
    res.status(201).json(video.comments[video.comments.length - 1]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.comments = video.comments.filter(
      (c) => c._id.toString() !== req.params.commentId
    );

    await video.save();
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
