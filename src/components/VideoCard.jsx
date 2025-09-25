import React from "react";

function VideoCard({ id, title, channel, views, thumbnail }) {
  return (
    <div className="cursor-pointer">
      <img
        src={thumbnail}
        alt={title}
        className="w-full h-40 object-cover rounded-lg"
      />
      <div className="mt-2">
        <h3 className="text-sm font-semibold line-clamp-2">{title}</h3>
        <p className="text-xs text-gray-600">{channel}</p>
        <p className="text-xs text-gray-500">{views} views</p>
      </div>
    </div>
  );
}

export default VideoCard;
