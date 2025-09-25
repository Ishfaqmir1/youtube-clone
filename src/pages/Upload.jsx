// src/pages/Upload.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Upload = ({ user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const navigate = useNavigate();

  const handleUpload = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in to upload a video");
      navigate("/login");
      return;
    }

    // Get current videos from localStorage
    const existingVideos = JSON.parse(localStorage.getItem("videos")) || [];

    const newVideo = {
      id: Date.now(),
      title,
      description,
      thumbnail: thumbnail || "https://via.placeholder.com/300x200",
      videoUrl: videoUrl || "https://www.w3schools.com/html/mov_bbb.mp4",
      channel: user.username,
      views: "0",
      likes: 0,
      dislikes: 0,
      comments: [],
    };

    // Save back to localStorage
    localStorage.setItem("videos", JSON.stringify([newVideo, ...existingVideos]));

    // Redirect to new video page
    navigate(`/video/${newVideo.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Upload Video</h2>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-2 rounded"
          rows="4"
        />
        <input
          type="text"
          placeholder="Thumbnail URL"
          value={thumbnail}
          onChange={(e) => setThumbnail(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Video URL"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Upload
        </button>
      </form>
    </div>
  );
};

export default Upload;
