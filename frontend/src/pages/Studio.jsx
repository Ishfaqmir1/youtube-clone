import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";

function Studio() {
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("Branding");

  const [form, setForm] = useState({
    channelName: "",
    description: "",
    avatar: "",
    channelBanner: "",
  });

  const navigate = useNavigate();

  //  Fetch logged-in user’s channel
  const fetchMyChannel = async () => {
    try {
      const res = await API.get("/channel/me", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      const myChannel = res.data[0];
      if (!myChannel) {
        toast.error("No channel found for your account.");
        navigate("/create-channel");
        return;
      }

      setChannel(myChannel);
      setForm({
        channelName: myChannel.channelName || "",
        description: myChannel.description || "",
        avatar: myChannel.avatar || "",
        channelBanner: myChannel.channelBanner || "",
      });
    } catch (err) {
      console.error("Error fetching channel:", err);
      toast.error("Failed to load channel data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyChannel();
  }, []);

  //  Handle Save
  const handleSave = async () => {
    if (!channel) return;
    setSaving(true);
    try {
      await API.put(`/channel/${channel._id}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      toast.success("Channel updated successfully!");
      fetchMyChannel();
    } catch (err) {
      console.error("Error updating channel:", err);
      toast.error("Failed to update channel.");
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  if (loading)
    return <p className="text-center mt-10 text-gray-500">Loading Studio...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6 text-gray-900 dark:text-gray-100">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Channel Customization
      </h1>

      {/*  Tabs */}
      <div className="flex border-b mb-6 overflow-x-auto no-scrollbar">
        {["Layout", "Branding", "Basic Info"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-semibold text-sm border-b-2 transition ${
              activeTab === tab
                ? "border-red-600 text-red-600"
                : "border-transparent text-gray-500 hover:text-black dark:hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/*  Branding Tab */}
      {activeTab === "Branding" && (
        <div className="space-y-10">
          {/* Banner */}
          <div>
            <h2 className="text-lg font-bold mb-3">Banner Image</h2>
            <div className="relative w-full h-48 sm:h-56 rounded-lg overflow-hidden bg-gray-300 dark:bg-gray-800">
              <img
                src={
                  form.channelBanner ||
                  "https://www.gstatic.com/youtube/img/channels/banner_placeholder.png"
                }
                alt="Banner Preview"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              name="channelBanner"
              value={form.channelBanner}
              onChange={handleChange}
              placeholder="Paste banner image URL..."
              className="mt-3 w-full border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-transparent"
            />
          </div>

          {/* Avatar */}
          <div>
            <h2 className="text-lg font-bold mb-3">Profile Picture</h2>
            <div className="flex items-center gap-6">
              <img
                src={form.avatar || "https://via.placeholder.com/100"}
                alt="Avatar Preview"
                className="w-28 h-28 rounded-full border-4 border-white dark:border-gray-800 shadow"
              />
              <input
                type="text"
                name="avatar"
                value={form.avatar}
                onChange={handleChange}
                placeholder="Paste avatar image URL..."
                className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-transparent w-full sm:w-1/2"
              />
            </div>
          </div>
        </div>
      )}

      {/*  Basic Info Tab */}
      {activeTab === "Basic Info" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold mb-2">Channel Name</h2>
            <input
              type="text"
              name="channelName"
              value={form.channelName}
              onChange={handleChange}
              className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-transparent"
            />
          </div>

          <div>
            <h2 className="text-lg font-bold mb-2">Description</h2>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              placeholder="Tell viewers about your channel..."
              className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded bg-transparent"
            />
          </div>

          <div className="text-sm text-gray-500">
            <p>
              The information you provide here appears publicly on your channel
              page.
            </p>
          </div>
        </div>
      )}

      {/*  Layout Tab */}
      {activeTab === "Layout" && (
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <h2 className="text-lg font-bold mb-2">Channel Layout</h2>
          <p>
            Coming soon — configure featured sections, trailers, and playlists
            just like YouTube Studio!
          </p>
        </div>
      )}

      {/*  Buttons */}
      <div className="flex justify-end gap-4 mt-10 border-t pt-6">
        <button
          onClick={() => navigate(`/channel/${channel?._id}`)}
          className="px-5 py-2 rounded-full font-medium bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        >
          View Channel
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`px-6 py-2 rounded-full font-semibold text-white ${
            saving ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {saving ? "Saving..." : "Publish"}
        </button>
      </div>
    </div>
  );
}

export default Studio;
