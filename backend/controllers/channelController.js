import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

export const createChannel = async (req, res) => {
  try {
    const { channelName, handle, description, avatar, channelBanner } = req.body;
    const newChannel = new Channel({
      channelName,
      handle,
      description,
      avatar,
      channelBanner,
      owner: req.user._id
    });
    await newChannel.save();
    res.status(201).json(newChannel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("videos");
    if (!channel) return res.status(404).json({ msg: "Channel not found" });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ msg: "Channel not found" });
    if (String(channel.owner) !== String(req.user._id))
      return res.status(403).json({ msg: "Not authorized" });

    Object.assign(channel, req.body);
    await channel.save();
    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteChannel = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ msg: "Channel not found" });
    if (String(channel.owner) !== String(req.user._id))
      return res.status(403).json({ msg: "Not authorized" });

    await Video.deleteMany({ channel: channel._id });
    await channel.deleteOne();
    res.json({ msg: "Channel deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
