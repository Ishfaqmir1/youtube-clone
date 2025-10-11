import express from "express";
import Video from "../models/Video.model.js";
import Channel from "../models/Channel.model.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { q, search, category, sort } = req.query;
    let filter = {};

    //  Search by title
    if (q || search) {
      filter.title = { $regex: q || search, $options: "i" };
    }

    // Filter by category
    if (category && category !== "All") {
      filter.category = category;
    }

    //  Sorting
    let sortOption = { createdAt: -1 }; // default: latest
    if (sort === "oldest") sortOption = { createdAt: 1 };
    if (sort === "popular") sortOption = { views: -1 };

    const videos = await Video.find(filter)
      .populate("channel", "channelName handle avatar")
      .sort(sortOption);

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * -----------------------
 * GET Shorts only
 * -----------------------
 */
router.get("/shorts", async (req, res) => {
  try {
    const shorts = await Video.find({ isShort: true })
      .populate("channel", "channelName handle avatar")
      .sort({ createdAt: -1 });

    res.json(shorts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * -----------------------
 * Upload a new video
 * -----------------------
 */
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, videoUrl, thumbnail, category, isShort } = req.body;

    if (!title || !videoUrl) {
      return res
        .status(400)
        .json({ error: "Title and video URL are required" });
    }

    // find channel of logged-in user
    const channel = await Channel.findOne({ owner: req.user._id });
    if (!channel) {
      return res.status(400).json({ error: "You must create a channel first" });
    }

    const video = new Video({
      title,
      description,
      videoUrl,
      thumbnail,
      category: category || "General", // default category
      isShort: isShort || false,
      channel: channel._id,
    });

    await video.save();

    // Push into channel's videos
    channel.videos.push(video._id);
    await channel.save();

    res
      .status(201)
      .json(await video.populate("channel", "channelName handle avatar"));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 
 * GET single video by ID
 * 
 */
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("channel", "channelName handle avatar")
      .populate({
        path: "comments",
        populate: { path: "user", select: "username avatar" },
      });

    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 
 * Increment view count
 *
 */
router.post("/:id/view", async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("channel", "channelName handle avatar");

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 
 * Like video
 * 
 */
router.post("/:id/like", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (!video.likes.includes(req.user._id)) {
      video.likes.push(req.user._id);
      video.dislikes = video.dislikes.filter(
        (u) => u.toString() !== req.user._id.toString()
      );
    }

    await video.save();
    const updated = await video.populate("channel", "channelName handle avatar");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 
 * Dislike video
 * 
 */
router.post("/:id/dislike", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (!video.dislikes.includes(req.user._id)) {
      video.dislikes.push(req.user._id);
      video.likes = video.likes.filter(
        (u) => u.toString() !== req.user._id.toString()
      );
    }

    await video.save();
    const updated = await video.populate("channel", "channelName handle avatar");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * 
 * Delete a video
 *
 */
router.delete("/:id", protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    // Only the owner of the channel can delete
    const channel = await Channel.findById(video.channel);
    if (channel.owner.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Not authorized to delete this video" });
    }

    await video.deleteOne();

    // Remove from channel.videos array
    channel.videos = channel.videos.filter(
      (v) => v.toString() !== video._id.toString()
    );
    await channel.save();

    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
