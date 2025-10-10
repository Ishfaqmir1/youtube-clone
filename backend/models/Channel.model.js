import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
  channelName: { type: String, required: true },
  handle: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  description: { type: String },
  avatar: { type: String },
  channelBanner: { type: String },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // array of users
  videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }]
}, { timestamps: true });

export default mongoose.model("Channel", channelSchema);
