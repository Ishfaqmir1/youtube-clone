// src/pages/Upload.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Upload() {
  const [form, setForm] = useState({
    title: "",
    channelName: "",
    thumbnailUrl: "",
    videoUrl: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/videos", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Upload Video</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Video Title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="channelName"
          placeholder="Channel Name"
          value={form.channelName}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="thumbnailUrl"
          placeholder="Thumbnail URL"
          value={form.thumbnailUrl}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <input
          type="text"
          name="videoUrl"
          placeholder="Video URL (mp4/youtube)"
          value={form.videoUrl}
          onChange={handleChange}
          required
          className="w-full border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Upload
        </button>
      </form>
    </div>
  );
}

export default Upload;
