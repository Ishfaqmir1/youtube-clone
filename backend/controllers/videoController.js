import Video from "../models/Video.model.js";
import Channel from "../models/Channel.model.js";

//   Normalize video URLs 
const normalizeUrl = (url) => {
  if (!url) return "";

  // Shorts → embed
  if (url.includes("youtube.com/shorts/")) {
    const id = url.split("shorts/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // youtu.be → embed
  if (url.includes("youtu.be")) {
    const id = url.split("youtu.be/")[1].split("?")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // youtube.com/watch?v=ID → embed
  if (url.includes("watch?v=")) {
    const id = url.split("watch?v=")[1].split("&")[0];
    return `https://www.youtube.com/embed/${id}`;
  }

  // youtube.com/embed/ already good
  if (url.includes("youtube.com/embed/")) {
    return url;
  }

  // Vimeo → embed
  if (url.includes("vimeo.com")) {
    const id = url.split("/").pop().split("?")[0];
    return `https://player.vimeo.com/video/${id}`;
  }

  // mp4 or direct URL
  return url;
};


//  Get all videos
export const getVideos = async (req, res) => {
  try {
    const videos = await Video.find()
      .populate("uploadedBy", "username email")
      .populate("channel", "name handle")
      .sort({ createdAt: -1 });

    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//  Get single video 
export const getVideoById = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id)
      .populate("uploadedBy", "username email")
      .populate("channel", "name handle")
      .populate("comments.user", "username email");

    if (!video) return res.status(404).json({ error: "Video not found" });

    // Increment views
    video.views = (video.views || 0) + 1;
    await video.save();

    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Add new video
export const addVideo = async (req, res) => {
  try {
    const { title, channelId, thumbnail, videoUrl, isShort, isLive } = req.body;

    const channel = await Channel.findById(channelId);
    if (!channel) return res.status(404).json({ error: "Channel not found" });

    const normalizedUrl = normalizeUrl(videoUrl);

    const newVideo = new Video({
      title,
      channel: channel._id,
      thumbnail,
      videoUrl: normalizedUrl,
      uploadedBy: req.user.id,
      isShort: isShort || false,
      isLive: isLive || false,
      views: 0,
    });

    await newVideo.save();

    channel.videos.push(newVideo._id);
    await channel.save();

    res.status(201).json(newVideo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update video 
export const updateVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { title, thumbnail, videoUrl } = req.body;
    if (title) video.title = title;
    if (thumbnail) video.thumbnail = thumbnail;
    if (videoUrl) video.videoUrl = normalizeUrl(videoUrl);

    await video.save();
    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete video 
export const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (video.uploadedBy.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Video.findByIdAndDelete(req.params.id);

    await Channel.findByIdAndUpdate(video.channel, {
      $pull: { videos: video._id },
    });

    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//  Like video -
export const likeVideo = async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.dislikes = video.dislikes.filter(
      (uid) => uid.toString() !== req.user.id
    );

    if (video.likes.includes(req.user.id)) {
      video.likes = video.likes.filter((uid) => uid.toString() !== req.user.id);
    } else {
      video.likes.push(req.user.id);
    }

    await video.save();

    video = await Video.findById(video._id)
      .populate("uploadedBy", "username")
      .populate("channel", "name handle");

    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//  Dislike video 
export const dislikeVideo = async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    video.likes = video.likes.filter(
      (uid) => uid.toString() !== req.user.id
    );

    if (video.dislikes.includes(req.user.id)) {
      video.dislikes = video.dislikes.filter(
        (uid) => uid.toString() !== req.user.id
      );
    } else {
      video.dislikes.push(req.user.id);
    }

    await video.save();

    video = await Video.findById(video._id)
      .populate("uploadedBy", "username")
      .populate("channel", "name handle");

    res.json(video);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//  Add comment 
export const addComment = async (req, res) => {
  try {
    let video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });

    const newComment = { text: req.body.text, user: req.user.id };
    video.comments.push(newComment);

    await video.save();

    video = await Video.findById(video._id).populate("comments.user", "username email");

    const savedComment = video.comments[video.comments.length - 1];
    res.status(201).json(savedComment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete comment 
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
