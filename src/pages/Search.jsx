import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";

// Mock video data 
const allVideos = [
  { id: 1, title: "Learn React in 10 Minutes ", channel: "Code with Ishfaq", views: "25K", thumbnail: "https://picsum.photos/300/200?random=1" },
  { id: 2, title: "Tailwind CSS Crash Course ", channel: "Dev Academy", views: "12K", thumbnail: "https://picsum.photos/300/200?random=2" },
  { id: 3, title: "JavaScript Tips & Tricks ", channel: "Web Simplified", views: "40K", thumbnail: "https://picsum.photos/300/200?random=3" },
  { id: 4, title: "Building YouTube Clone ", channel: "Ishfaq Dev", views: "8K", thumbnail: "https://picsum.photos/300/200?random=4" },
  { id: 5, title: "Top 10 React Libraries in 2025 ", channel: "Code with Ishfaq", views: "120K", thumbnail: "https://picsum.photos/300/200?random=5" },
  { id: 6, title: "AI Tools Every Developer Should Know ", channel: "Tech World", views: "95K", thumbnail: "https://picsum.photos/300/200?random=6" },
  { id: 7, title: "Next.js vs React in 2025 ", channel: "Dev Academy", views: "80K", thumbnail: "https://picsum.photos/300/200?random=7" },
];

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const filteredVideos = allVideos.filter((video) =>
    video.title.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        🔍 Search Results for: <span className="text-blue-500">{query}</span>
      </h1>

      {filteredVideos.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredVideos.map((video) => (
            <Link key={video.id} to={`/video/${video.id}`}>
              <VideoCard {...video} />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No videos found for "{query}"</p>
      )}
    </div>
  );
}
