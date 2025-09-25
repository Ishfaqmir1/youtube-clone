import { Link } from "react-router-dom";
import VideoCard from "../components/VideoCard";

const subscribedVideos = [
  {
    id: 8,
    title: "Daily Coding Challenge 💻",
    channel: "Ishfaq Dev",
    views: "20K",
    thumbnail: "https://picsum.photos/300/200?random=8",
  },
  {
    id: 9,
    title: "UI Design with Tailwind 🎨",
    channel: "Design Hub",
    views: "15K",
    thumbnail: "https://picsum.photos/300/200?random=9",
  },
  {
    id: 10,
    title: "MongoDB Crash Course 🍃",
    channel: "Backend Mastery",
    views: "10K",
    thumbnail: "https://picsum.photos/300/200?random=10",
  },
];

export default function Subscriptions() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">📺 Subscriptions</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {subscribedVideos.map((video) => (
          <Link key={video.id} to={`/video/${video.id}`}>
            <VideoCard {...video} />
          </Link>
        ))}
      </div>
    </div>
  );
}
