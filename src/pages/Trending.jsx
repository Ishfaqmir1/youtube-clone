import { Link } from "react-router-dom";
import VideoCard from "../components/VideoCard";

const trendingVideos = [
  {
    id: 5,
    title: "Top 10 React Libraries in 2025 🔥",
    channel: "Code with Ishfaq",
    views: "120K",
    thumbnail: "https://picsum.photos/300/200?random=5",
  },
  {
    id: 6,
    title: "AI Tools Every Developer Should Know 🤖",
    channel: "Tech World",
    views: "95K",
    thumbnail: "https://picsum.photos/300/200?random=6",
  },
  {
    id: 7,
    title: "Next.js vs React in 2025 ⚡",
    channel: "Dev Academy",
    views: "80K",
    thumbnail: "https://picsum.photos/300/200?random=7",
  },
];

export default function Trending() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">🔥 Trending Now</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {trendingVideos.map((video) => (
          <Link key={video.id} to={`/video/${video.id}`}>
            <VideoCard {...video} />
          </Link>
        ))}
      </div>
    </div>
  );
}
