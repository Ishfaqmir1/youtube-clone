import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import User from "../models/User.model.js";
import Channel from "../models/Channel.model.js";

const router = express.Router();

//  Get logged-in user profile + channel + videos
router.get("/me", protect, async (req, res) => {
  try {
    // Get user without password
    const user = await User.findById(req.user._id).select("-password");

    // Find the user's channel (if any)
    const channel = await Channel.findOne({ owner: req.user._id })
      .populate("videos")
      .populate("subscribers", "username email");

    // Placeholder extras
    const playlists = [];
    const posts = [];

    res.json({
      user,
      channel,
      videos: channel?.videos || [],
      playlists,
      posts,
      hasChannel: !!channel, 
      channelId: channel?._id || null, 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
