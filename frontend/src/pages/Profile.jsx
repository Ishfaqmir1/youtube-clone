// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import VideoCard from "../components/VideoCard";
import { FaRegCirclePlay } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("Home");
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const navigate = useNavigate();

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = res.data;
        setProfile(data);

        //  Strong owner check
        if (
          currentUser &&
          data?.user?._id &&
          String(currentUser._id) === String(data.user._id)
        ) {
          setIsOwner(true);
        } else {
          setIsOwner(false);
        }
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile)
    return <p className="text-center mt-6 text-gray-500">Loading profile...</p>;

  const channel = profile.channel;

  //  Case: No channel yet
  if (!channel) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center text-gray-800 dark:text-gray-200">
        <h1 className="text-2xl font-bold mb-2">{profile.user.username}</h1>
        <p className="text-gray-600">{profile.user.email}</p>
        <div className="mt-6">
          <p className="text-gray-500 mb-3">You don’t have a channel yet.</p>
          <button
            onClick={() => navigate("/create-channel")}
            className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold hover:bg-red-700 transition"
          >
            Create Channel
          </button>
        </div>
      </div>
    );
  }

  //  Case: Channel exists
  const videos = channel.videos || [];
  const shorts = videos.filter((v) => v.isShort);
  const regularVideos = videos.filter((v) => !v.isShort);

  //  Filter videos dynamically
  const filteredRegularVideos = regularVideos.filter((video) =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const filteredShorts = shorts.filter((video) =>
    video.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto text-gray-900 dark:text-gray-100 pb-10">
      {/*  Channel Banner */}
      <div
        className="h-44 sm:h-56 bg-gray-300 dark:bg-gray-800"
        style={{
          backgroundImage: `url(${
            channel.channelBanner ||
            "https://www.gstatic.com/youtube/img/channels/banner_placeholder.png"
          })`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      ></div>

      {/*  Channel Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 -mt-12 sm:-mt-14 relative z-10">
        <div className="flex items-center gap-4">
          <img
            src={channel.avatar || "https://via.placeholder.com/100"}
            alt="Channel Avatar"
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-gray-900 shadow-md bg-white"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              {channel.channelName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{channel.handle}</p>
            <p className="text-gray-500 text-sm">
              {channel.subscribers?.length || 0} subscribers •{" "}
              {channel.videos?.length || 0} videos
            </p>
          </div>
        </div>

        {/*  Buttons */}
        <div className="mt-4 sm:mt-0 flex gap-3">
          {/* Owner controls only */}
          {isOwner ? (
            <>
              <button
                onClick={() => navigate("/studio")}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full font-medium text-sm"
              >
                Customize channel
              </button>

              <button
                onClick={() => navigate("/upload")}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-4 py-2 rounded-full font-medium text-sm"
              >
                Manage videos
              </button>
            </>
          ) : null}
        </div>
      </div>

      {/*  Tabs + Inline Search */}
      <div className="flex justify-between items-center border-b mt-6 px-4 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="flex">
          {["Home", "Videos", "Shorts", "About"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-red-600 text-red-600"
                  : "text-gray-600 hover:text-black dark:hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/*  Search Inline */}
        <div className="flex items-center gap-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search..."
              className="border border-gray-300 dark:border-gray-700 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 dark:bg-gray-800 dark:text-white w-32 sm:w-48 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <FiSearch className="text-gray-600 dark:text-gray-300" size={20} />
          </button>
        </div>
      </div>

      {/*  Tab Content */}
      <div className="p-4 sm:p-6">
        {activeTab === "Home" && (
          <>
            <h2 className="text-lg font-bold mb-3">Videos</h2>
            {filteredRegularVideos.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {filteredRegularVideos.map((video) => (
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

        {activeTab === "Videos" && (
          <>
            <h2 className="text-lg font-bold mb-3">All Videos</h2>
            {filteredRegularVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {filteredRegularVideos.map((video) => (
                  <VideoCard key={video._id} video={video} />
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No videos found.</p>
            )}
          </>
        )}

        {activeTab === "Shorts" && (
          <>
            <h2 className="text-lg font-bold mb-3">Shorts</h2>
            {filteredShorts.length > 0 ? (
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                {filteredShorts.map((video) => (
                  <div key={video._id} className="flex-shrink-0 w-36 sm:w-44">
                    <VideoCard video={video} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No Shorts found.</p>
            )}
          </>
        )}

        {activeTab === "About" && (
          <div className="text-gray-700 dark:text-gray-300 mt-4">
            <h2 className="text-lg font-bold mb-3">About</h2>
            <p>{channel.description || "No description yet."}</p>
            <p className="mt-2 text-sm text-gray-500">
              Joined: {new Date(profile.user.createdAt).toDateString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
