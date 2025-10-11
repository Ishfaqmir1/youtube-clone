// src/pages/Channel.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

function Channel() {
  const [form, setForm] = useState({
    channelName: "",
    handle: "",
    avatar: "",
    channelBanner: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.handle.startsWith("@")) {
      form.handle = `@${form.handle}`;
    }

    setLoading(true);
    try {
      const res = await API.post("/channel", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      toast.success("🎉 Channel created successfully!");
      navigate(`/channel/${res.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
      {/* Form Section */}
      <div className="bg-white dark:bg-gray-900 shadow p-6 rounded">
        <h2 className="text-xl font-bold mb-4 text-center">
          Create Your Channel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            name="handle"
            placeholder="@handle"
            value={form.handle}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="avatar"
            placeholder="Avatar Image URL"
            value={form.avatar}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <input
            type="text"
            name="channelBanner"
            placeholder="Banner Image URL"
            value={form.channelBanner}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          <textarea
            name="description"
            placeholder="Channel Description (optional)"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="w-full border px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded text-white font-semibold ${
              loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {loading ? "Creating..." : "Create Channel"}
          </button>
        </form>
      </div>

      {/* Preview Section */}
      <div className="bg-gray-100 dark:bg-gray-800 shadow rounded p-6 flex flex-col items-center justify-center">
        <h3 className="text-lg font-semibold mb-4">Channel Preview</h3>

        {/* Banner */}
        <div
          className="w-full h-32 sm:h-40 rounded-lg bg-gray-300 flex items-center justify-center text-gray-500 text-sm"
          style={{
            backgroundImage: `url(${form.channelBanner || ""})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {!form.channelBanner && "Channel Banner Preview"}
        </div>

        {/* Avatar + Info */}
        <div className="flex items-center mt-4 space-x-4">
          <img
            src={form.avatar || "https://via.placeholder.com/100"}
            alt="Avatar Preview"
            className="w-20 h-20 rounded-full border-4 border-white shadow-lg"
          />
          <div>
            <h4 className="text-xl font-bold">
              {form.channelName || "Channel Name"}
            </h4>
            <p className="text-gray-600">
              {form.handle || "@handle"}
            </p>
          </div>
        </div>

        <p className="mt-3 text-gray-500 text-center">
          {form.description || "Channel description will appear here..."}
        </p>
      </div>
    </div>
  );
}

export default Channel;
