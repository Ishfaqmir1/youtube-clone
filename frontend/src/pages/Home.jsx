import React, { useEffect, useState } from "react";
import API from "../api"; 
import VideoCard from "../components/VideoCard";

const Home = () => {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get("/videos");
        setVideos(res.data);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, []);

  return (
    <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4 p-4">
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
    </div>
  );
};

export default Home;
