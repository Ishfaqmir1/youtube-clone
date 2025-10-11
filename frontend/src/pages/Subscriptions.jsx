import React, { useEffect, useState } from "react";
import API from "../api";
import VideoCard from "../components/VideoCard";

function Subscriptions() {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = async () => {
    try {
      const res = await API.get("/channel/subscriptions", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setChannels(res.data);
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (loading) return <p className="text-center mt-6">Loading subscriptions...</p>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Subscriptions</h1>

      {channels.length === 0 ? (
        <p className="text-gray-600">You haven’t subscribed to any channels yet.</p>
      ) : (
        channels.map((channel) => (
          <div key={channel._id} className="mb-10">
            {/* Channel Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={channel.avatar || "https://via.placeholder.com/60"}
                alt="Channel Avatar"
                className="w-14 h-14 rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold">{channel.channelName}</h2>
                <p className="text-gray-500">{channel.handle}</p>
                <p className="text-xs text-gray-400">
                  {channel.subscribers?.length || 0} subscribers
                </p>
              </div>
            </div>

            {/* Channel Videos */}
            {channel.videos && channel.videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {channel.videos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 ml-2">No videos yet from this channel.</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Subscriptions;
