import { useParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";

export default function VideoDetail() {
  const { id } = useParams();

  // Mock single video (in real app, fetch by id)
  const video = {
    id,
    title: "Learn React in 10 Minutes 🚀",
    channel: "Code with Ishfaq",
    views: "25K",
    description:
      "In this tutorial, we go through the fundamentals of React and how you can get started quickly.",
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
  };

  // Suggested videos
  const suggestions = [
    {
      id: 2,
      title: "Tailwind CSS Crash Course 💨",
      channel: "Dev Academy",
      views: "12K",
      thumbnail: "https://picsum.photos/300/200?random=5",
    },
    {
      id: 3,
      title: "JavaScript Tips & Tricks ⚡",
      channel: "Web Simplified",
      views: "40K",
      thumbnail: "https://picsum.photos/300/200?random=6",
    },
    {
      id: 4,
      title: "Building YouTube Clone 🎥",
      channel: "Ishfaq Dev",
      views: "8K",
      thumbnail: "https://picsum.photos/300/200?random=7",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Video Player Section */}
      <div className="lg:col-span-2">
        <video
          src={video.videoUrl}
          controls
          className="w-full rounded-lg shadow"
        ></video>
        <h1 className="text-xl font-bold mt-4">{video.title}</h1>
        <p className="text-gray-600">{video.channel} • {video.views} views</p>
        <p className="mt-2 text-gray-700">{video.description}</p>
      </div>

      {/* Suggested Videos */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Suggested Videos</h2>
        <div className="space-y-4">
          {suggestions.map((s) => (
            <VideoCard key={s.id} {...s} />
          ))}
        </div>
      </div>
    </div>
  );
}
