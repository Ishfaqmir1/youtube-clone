import { Link } from "react-router-dom";
import VideoCard from "../components/VideoCard";

const mockVideos = [
  {
    id: 1,
    title: "Learn React in 10 Minutes 🚀",
    channel: "Code with Ishfaq",
    views: "25K",
    thumbnail: "https://picsum.photos/300/200?random=1",
  },
  {
    id: 2,
    title: "Tailwind CSS Crash Course 💨",
    channel: "Dev Academy",
    views: "12K",
    thumbnail: "https://picsum.photos/300/200?random=2",
  },
  {
    id: 3,
    title: "JavaScript Tips & Tricks ⚡",
    channel: "Web Simplified",
    views: "40K",
    thumbnail: "https://picsum.photos/300/200?random=3",
  },
  {
    id: 4,
    title: "Building YouTube Clone 🎥",
    channel: "Ishfaq Dev",
    views: "8K",
    thumbnail: "https://picsum.photos/300/200?random=4",
  },
];

export default function Home() {
  return (
   <div>
      <h1 className="text-2xl font-bold mb-4">Recommended Videos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {mockVideos.map((video) => (
          <Link key={video.id} to={`/video/${video.id}`}>
            <VideoCard {...video} />
          </Link>
        ))}
      </div>
      </div>
  );
}
