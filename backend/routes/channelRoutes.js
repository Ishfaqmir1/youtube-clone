import express from "express";
import Channel from "../models/Channel.model.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * -----------------------
 * Create a channel
 * -----------------------
 */
router.post("/", protect, async (req, res) => {
  try {
    const { channelName, handle, avatar, channelBanner, description } = req.body;

    const existing = await Channel.findOne({ owner: req.user._id });
    if (existing) {
      return res.status(400).json({ error: "You already have a channel" });
    }

    const channel = new Channel({
      channelName,
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      avatar,
      channelBanner,
      description,
      owner: req.user._id,
    });

    await channel.save();
    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * -----------------------
 * Get logged-in user's channels
 * -----------------------
 */
router.get("/me", protect, async (req, res) => {
  try {
    const channels = await Channel.find({ owner: req.user._id })
      .populate("videos");
    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * -----------------------
 * Get all subscriptions for logged-in user
 * -----------------------
 */
router.get("/subscriptions", protect, async (req, res) => {
  try {
    const channels = await Channel.find({ subscribers: req.user._id })
      .populate("owner", "username email")
      .populate({
        path: "videos",
        options: { sort: { createdAt: -1 }, limit: 3 },
      });

    res.json(channels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * -----------------------
 * Get channel by ID 
 * -----------------------
 */
router.get("/:id", protect, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate({
        path: "videos",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "channel",
          select: "channelName handle avatar",
        },
      })
      .populate("owner", "username email");

    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const userId = req.user?._id?.toString();
    const isSubscribed = userId
      ? channel.subscribers.some((s) => String(s) === userId)
      : false;
    const isOwner = String(channel.owner?._id || channel.owner) === userId;

    //  Always return a `videos` array 
    const videos = Array.isArray(channel.videos) ? channel.videos : [];

    res.json({
      ...channel.toObject(),
      videos,
      isSubscribed,
      isOwner,
      subscriberCount: channel.subscribers.length,
    });
  } catch (err) {
    console.error("Error fetching channel:", err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * -----------------------
 * Subscribe / Unsubscribe
 * -----------------------
 */
router.post("/:id/subscribe", protect, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    const userId = req.user._id.toString();
    const ownerId = channel.owner.toString();

    //  Prevent subscribing to own channel
    if (userId === ownerId) {
      return res.status(400).json({ error: "You cannot subscribe to your own channel." });
    }

    //  Toggle subscription
    const isSubscribed = channel.subscribers.some(
      (sub) => sub.toString() === userId
    );

    if (isSubscribed) {
      channel.subscribers = channel.subscribers.filter(
        (sub) => sub.toString() !== userId
      );
    } else {
      channel.subscribers.push(req.user._id);
    }

    await channel.save();

    res.json({
      subscribed: !isSubscribed,
      subscriberCount: channel.subscribers.length,
    });
  } catch (err) {
    console.error("Subscribe error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/**
 * -----------------------
 * Update Channel Details 
 * -----------------------
 */
router.put("/:id", protect, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) {
      return res.status(404).json({ error: "Channel not found" });
    }

    //  Only the owner can update their channel
    if (String(channel.owner) !== String(req.user._id)) {
      return res.status(403).json({ error: "Not authorized to update this channel." });
    }

    const { channelName, description, avatar, channelBanner } = req.body;

    if (channelName) channel.channelName = channelName;
    if (description !== undefined) channel.description = description;
    if (avatar) channel.avatar = avatar;
    if (channelBanner) channel.channelBanner = channelBanner;

    await channel.save();

    res.json({
      message: "Channel updated successfully",
      channel,
    });
  } catch (err) {
    console.error("Channel update error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
