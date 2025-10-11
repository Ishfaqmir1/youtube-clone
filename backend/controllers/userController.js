import Video from "../models/Video.model.js";
import Channel from "../models/Channel.model.js";

export const getMe = async (req, res) => {
  try {
    const user = req.user;

    // Fetch user's videos
    const videos = await Video.find({ uploadedBy: user._id });

    // Fetch user's channels
    const channels = await Channel.find({ owner: user._id }).populate("videos");

    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      subscribers: 0, 
      videos,
      channels, 
    });
  } catch (err) {
    console.error("getMe error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
