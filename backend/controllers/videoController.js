// backend/controllers/videoController.js
import Video from "../models/Video.model.js";

// 📌 Get all videos
export const getVideos = async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
};

// 📌 Get video by ID
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 Add new video
export const addVideo = async (req, res) => {
  try {
    const { title, channel, thumbnail, videoUrl } = req.body;
    const newVideo = new Video({
      title,
      channel,
      thumbnail,
      videoUrl,
      uploadedBy: req.user.id,
    });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 Update video
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Only uploader can update
    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to update this video" });
    }

    const { title, channel, thumbnail, videoUrl } = req.body;
    video.title = title || video.title;
    video.channel = channel || video.channel;
    video.thumbnail = thumbnail || video.thumbnail;
    video.videoUrl = videoUrl || video.videoUrl;

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 Delete video
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Only uploader can delete
    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized to delete this video" });
    }

    await video.deleteOne();
    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 📌 Like video
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

// 📌 Dislike video
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

// 📌 Add comment
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

// 📌 Delete comment
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
