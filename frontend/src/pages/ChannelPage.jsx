import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import VideoCard from "../components/VideoCard";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

function ChannelPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState("Home");
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchChannel = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/channel/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const data = res.data;
      setChannel(data);
      setIsOwner(data.isOwner);
      setSubscribed(data.isSubscribed);
    } catch (err) {
      console.error("Error fetching channel:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannel();
  }, [id]);

  const handleSubscribe = async () => {
    if (isOwner) return;
    try {
      const res = await API.post(
        `/channel/${id}/subscribe`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setSubscribed(res.data.subscribed);
      setChannel((prev) =>
        prev ? { ...prev, subscriberCount: res.data.subscriberCount } : prev
      );
    } catch (err) {
      console.error("Subscribe error:", err);
    }
  };

  const toggleSearch = () => {
    setShowSearch((prev) => !prev);
    setTimeout(() => {
      if (!showSearch && searchRef.current) searchRef.current.focus();
    }, 150);
  };

  if (loading) return <p className="text-center mt-6">Loading channel...</p>;
  if (!channel) return <p className="text-center mt-6">Channel not found.</p>;

  const normalVideos = channel.videos?.filter((v) => !v.isShort) || [];
  const shorts = channel.videos?.filter((v) => v.isShort) || [];

  const filteredVideos = normalVideos.filter((v) =>
    v.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredShorts = shorts.filter((v) =>
    v.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto text-gray-900 dark:text-gray-100 pb-10 transition-colors duration-300">
      {/*  Banner */}
      <div
        className="h-48 sm:h-56 bg-gray-300 dark:bg-gray-800"
        style={{
          backgroundImage: `url(${
            channel.channelBanner || "https://via.placeholder.com/1200x200"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/*  Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 -mt-10">
        <div className="flex items-center space-x-4">
          <img
            src={channel.avatar || "https://via.placeholder.com/100"}
            alt="Channel Avatar"
            className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold">{channel.channelName}</h1>
            <p className="text-gray-600 dark:text-gray-400">{channel.handle}</p>
            <p className="text-gray-500 text-sm">
              {channel.subscriberCount || 0} subscribers •{" "}
              {channel.videos?.length || 0} videos
            </p>
          </div>
        </div>

        {/*  Buttons */}
        <div className="mt-4 sm:mt-0 flex gap-3">
          {isOwner ? (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                Customize channel
              </button>
              <button
                onClick={() => navigate("/upload")}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full text-sm font-medium"
              >
                Manage videos
              </button>
            </>
          ) : (
            <button
              onClick={handleSubscribe}
              className={`px-4 py-2 font-semibold rounded-full text-sm transition-all ${
                subscribed
                  ? "bg-gray-500 text-white"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>
      </div>

      {/*  Tabs + Search */}
      <div className="flex justify-between items-center border-b mt-6 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="flex">
          {["Home", "Videos", "Shorts", "About"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize ${
                activeTab === tab
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 relative">
          {showSearch && (
            <input
              ref={searchRef}
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white w-32 sm:w-48 transition-all"
            />
          )}
          <button
            onClick={toggleSearch}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <FiSearch className="text-gray-600 dark:text-gray-300" size={20} />
          </button>
        </div>
      </div>

      {/*  Tabs Content */}
      <div className="p-4 sm:p-6">
        {/*  HOME TAB */}
        {activeTab === "Home" && (
          <>
            <h2 className="text-lg font-bold mb-3">Videos</h2>
            {filteredVideos.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {filteredVideos.map((video) => (
                  <div key={video._id} className="flex-shrink-0 w-64 sm:w-72">
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No videos found.</p>
            )}

            {filteredShorts.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center gap-2 mb-3">
                  <FaRegCirclePlay className="text-red-600 text-xl" />
                  <h2 className="text-lg font-bold">Shorts</h2>
                </div>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                  {filteredShorts.map((video) => (
                    <div key={video._id} className="flex-shrink-0 w-36 sm:w-44">
                      <VideoCard video={video} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/*  VIDEOS TAB */}
        {activeTab === "Videos" && (
          <>
            <h2 className="text-lg font-bold mb-3">All Videos</h2>
            {filteredVideos.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                {filteredVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No videos available.</p>
            )}
          </>
        )}

        {/*  SHORTS TAB */}
        {activeTab === "Shorts" && (
          <>
            <h2 className="text-lg font-bold mb-3">Shorts</h2>
            {filteredShorts.length > 0 ? (
              <div className="flex gap-4 flex-wrap justify-start">
                {filteredShorts.map((video) => (
                  <div key={video._id} className="w-[180px]">
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No shorts available.</p>
            )}
          </>
        )}

        {/*  ABOUT TAB */}
        {activeTab === "About" && (
          <div className="mt-4">
            <h2 className="text-lg font-bold mb-3">About</h2>
            <p>{channel.description || "No description available."}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChannelPage;
