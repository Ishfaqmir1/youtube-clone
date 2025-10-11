import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api";

function Upload() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
    videoUrl: "",
    isShort: false,
    isLive: false,
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Handle form inputs
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCheckbox = (e) =>
    setForm({ ...form, [e.target.name]: e.target.checked });

  //  Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post("/videos", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("✅ Video uploaded successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300 px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 text-gray-900 dark:text-gray-100"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Upload Video
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Video Title */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Video Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter video title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Write a short description"
              value={form.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Thumbnail */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Thumbnail URL
            </label>
            <input
              type="text"
              name="thumbnail"
              placeholder="Enter thumbnail URL"
              value={form.thumbnail}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Video URL */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Video URL (mp4 link)
            </label>
            <input
              type="text"
              name="videoUrl"
              placeholder="Paste direct video URL"
              value={form.videoUrl}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Video Type Checkboxes */}
          <div className="flex gap-6 items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isShort"
                checked={form.isShort}
                onChange={handleCheckbox}
                className="accent-red-600"
              />
              <span>Short</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isLive"
                checked={form.isLive}
                onChange={handleCheckbox}
                className="accent-red-600"
              />
              <span>Live</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold transition-colors ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
            }`}
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default Upload;
