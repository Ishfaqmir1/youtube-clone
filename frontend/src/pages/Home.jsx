import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import API from "../api";
import VideoCard from "../components/VideoCard";
import { SiYoutubeshorts } from "react-icons/si";

const categories = [
  "All", "Music", "Podcasts", "Mixes", "Villages", "Web Development",
  "Ancient History", "Live", "Mountains", "Data Structures", "Web Series",
  "Dramedy", "Religious Recitation", "Qawwali", "Motivation", "Gaming",
  "Science", "Travel", "Lifestyle",
];

function Home({ sidebarCollapsed }) {
  const [videos, setVideos] = useState([]);
  const [shorts, setShorts] = useState([]);
  const [category, setCategory] = useState("All");
  const scrollRef = useRef(null);

  //  Fetch normal videos
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await API.get(`/videos?category=${category}`);
        const nonShorts = res.data.filter((v) => !v.isShort);
        setVideos(nonShorts);
      } catch (err) {
        console.error("Error fetching videos:", err);
      }
    };
    fetchVideos();
  }, [category]);

  //  Fetch Shorts separately
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await API.get("/videos/shorts");
        setShorts(res.data);
      } catch (err) {
        console.error("Error fetching shorts:", err);
      }
    };
    fetchShorts();
  }, []);

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });

  return (
    <div className="bg-gray-100 dark:bg-[#0f0f0f] min-h-screen text-gray-900 dark:text-white transition-colors duration-300">
      {/* Category Bar */}
      <div
        className={`fixed top-[56px] right-0 z-30 flex items-center justify-between 
        bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-[#272727] 
        px-2 transition-all duration-300
        ${sidebarCollapsed ? "md:left-[72px]" : "md:left-[240px]"}`}
      >
        <button
          onClick={scrollLeft}
          className="hidden sm:flex p-2 text-xl bg-gray-100 dark:bg-[#272727] rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3a3a]"
        >
          ‹
        </button>

        <div
          ref={scrollRef}
          className="flex-1 flex gap-3 overflow-x-auto no-scrollbar py-2 px-3 scroll-smooth"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                category === cat
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-gray-200 dark:bg-[#272727] text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-[#3a3a3a]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={scrollRight}
          className="hidden sm:flex p-2 text-xl bg-gray-100 dark:bg-[#272727] rounded-full hover:bg-gray-200 dark:hover:bg-[#3a3a3a]"
        >
          ›
        </button>
      </div>

      {/*  Content */}
      <div className="pt-[104px] pb-10 px-2 sm:px-4 lg:px-8 transition-all duration-300">
        {/* 🎥 Normal Videos */}
        {videos.length === 0 ? (
          <p className="text-center text-gray-500 mt-10">No videos found.</p>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
          >
            {videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))}
          </motion.div>
        )}

        {/* Divider */}
        <div className="border-b border-gray-300 dark:border-[#272727] my-10"></div>

        {/*  YouTube-Style Shorts Row */}
        {shorts.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="my-6"
          >
            {/* Shorts Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <SiYoutubeshorts className="text-red-600 text-xl" />
                <h2 className="text-lg font-semibold">Shorts</h2>
              </div>
              <Link
                to="/shorts"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                View all
              </Link>
            </div>

            {/* Shorts Horizontal Row */}
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
              {shorts.map((short) => (
                <Link
                  to="/shorts"
                  key={short._id}
                  className="flex-shrink-0 w-[170px] sm:w-[200px] cursor-pointer"
                >
                  <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-gray-300 dark:bg-[#272727]">
                    <img
                      src={short.thumbnail}
                      alt={short.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                    {/* Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black/30">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        className="w-10 h-10 text-white"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="mt-2 text-sm font-medium line-clamp-2">
                    {short.title}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {short.channel?.channelName || "Unknown"}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default Home;
