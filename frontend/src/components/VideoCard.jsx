import React from "react";
import { Link } from "react-router-dom";

function VideoCard({ video }) {
  const timeAgo = (date) => {
    if (!date) return "";
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };
    for (const key in intervals) {
      const value = Math.floor(seconds / intervals[key]);
      if (value >= 1) return `${value} ${key}${value > 1 ? "s" : ""} ago`;
    }
    return "Just now";
  };

  const isShort = video.isShort;

  return (
    <Link
      to={`/video/${video._id}`}
      className="cursor-pointer block group transition-transform"
    >
      <div className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden hover:shadow-md dark:hover:shadow-lg transition-all duration-300">
        {/*  Thumbnail */}
        <div
          className={`relative w-full overflow-hidden ${
            isShort ? "aspect-[9/16]" : "aspect-video"
          }`}
        >
          <img
            src={
              video.thumbnail ||
              "https://via.placeholder.com/320x180?text=No+Thumbnail"
            }
            alt={video.title || "Untitled Video"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
            onError={(e) => {
              e.target.src =
                "https://via.placeholder.com/320x180?text=Thumbnail+Unavailable";
            }}
          />
        </div>

        {/*  Info Section */}
        {!isShort ? (
          <div className="flex items-start gap-3 p-3">
            {/* Channel Avatar */}
            <img
              src={video.channel?.avatar || "https://via.placeholder.com/36"}
              alt="Channel Avatar"
              className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            />

            {/* Title & Meta */}
            <div className="flex-1 min-w-0">
              <h3
                className="text-[15px] font-semibold line-clamp-2 text-gray-900 dark:text-gray-100 group-hover:text-black dark:group-hover:text-white transition-colors duration-200"
                title={video.title}
              >
                {video.title || "Untitled Video"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {video.channel?.channelName || "Unknown Channel"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {video.views?.toLocaleString() || 0} views •{" "}
                {timeAgo(video.createdAt)}
              </p>
            </div>
          </div>
        ) : (
          // Shorts layout (compact)
          <div className="p-2">
            <h3
              className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2"
              title={video.title}
            >
              {video.title || "Untitled Short"}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {video.views?.toLocaleString() || 0} views • {timeAgo(video.createdAt)}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

export default VideoCard;
