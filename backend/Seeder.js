import mongoose from "mongoose";
import dotenv from "dotenv";
import { users, channels, videos } from "./DummyVideos.js";
import User from "./models/User.model.js";
import Channel from "./models/Channel.model.js";
import Video from "./models/Video.model.js";

dotenv.config();

// Simple color console helpers
const color = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
};

const seedData = async () => {
  try {
    console.log(color.yellow(" Connecting to MongoDB..."));
   await mongoose.connect(process.env.MONGO_URI);

    console.log(color.green("MongoDB Connected Successfully!"));

    console.log(color.yellow(" Clearing existing data..."));
    await Promise.all([
      User.deleteMany(),
      Channel.deleteMany(),
      Video.deleteMany(),
    ]);

    console.log(color.green("👤 Inserting users..."));
    const createdUsers = await User.insertMany(users);

    console.log(color.green("📺 Creating channels..."));
    const channelsWithOwner = channels.map((ch, i) => ({
      ...ch,
      owner: createdUsers[i % createdUsers.length]._id,
    }));
    const createdChannels = await Channel.insertMany(channelsWithOwner);

    console.log(color.green("🎬 Inserting videos..."));
    const videosWithChannel = videos.map((v, i) => ({
      ...v,
      channel: createdChannels[i % createdChannels.length]._id,
      createdAt: v.createdAt || new Date(),
    }));
    const createdVideos = await Video.insertMany(videosWithChannel);

    console.log(color.green("🔗 Linking videos to channels..."));
    for (const ch of createdChannels) {
      const channelVideos = createdVideos
        .filter((v) => v.channel.toString() === ch._id.toString())
        .map((v) => v._id);
      await Channel.findByIdAndUpdate(ch._id, { videos: channelVideos });
    }

    console.log(
      color.blue(`
Seeding Complete:
  Users: ${createdUsers.length}
  Channels: ${createdChannels.length}
  Videos: ${createdVideos.length}
`)
    );

    await mongoose.disconnect();
    console.log(color.green(" MongoDB Disconnected"));
    process.exit(0);
  } catch (err) {
    console.error(color.red(" Error during data seeding:"), err.message);
    process.exit(1);
  }
};

seedData();
