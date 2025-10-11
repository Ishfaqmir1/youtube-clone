import React, { useEffect, useState, useRef } from "react";
import API from "../api";
import { motion, AnimatePresence } from "framer-motion";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineComment,
  AiOutlineShareAlt,
  AiOutlineClose,
} from "react-icons/ai";

function Shorts() {
  const [shorts, setShorts] = useState([]);
  const [activeShort, setActiveShort] = useState(null); 
  const videoRefs = useRef([]);

  //  Detect theme
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true });
    return () => observer.disconnect();
  }, []);

  // Fetch Shorts
  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await API.get("/videos?category=All");
        const shortsOnly = res.data.filter((v) => v.isShort);
        setShorts(shortsOnly);
      } catch (err) {
        console.error("Error fetching shorts:", err);
      }
    };
    fetchShorts();
  }, []);

  //  Autoplay + pause logic
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) video.play().catch(() => {});
          else video.pause();
        });
      },
      { threshold: 0.7 }
    );
    videoRefs.current.forEach((v) => v && observer.observe(v));
    return () => observer.disconnect();
  }, [shorts]);

  // Handle Like Toggle (Frontend + API)
  const handleLike = async (id) => {
    const userId = localStorage.getItem("userId");
    setShorts((prev) =>
      prev.map((s) =>
        s._id === id
          ? {
              ...s,
              likes: s.likes?.includes(userId)
                ? s.likes.filter((uid) => uid !== userId)
                : [...(s.likes || []), userId],
            }
          : s
      )
    );

    try {
      await API.post(
        `/videos/${id}/like`,
        {},
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
    } catch (err) {
      console.error("Like error:", err);
    }
  };

  //  Comments Drawer
  const openComments = async (shortId) => {
    try {
      const res = await API.get(`/videos/${shortId}`);
      setActiveShort(res.data);
    } catch (err) {
      console.error("Error fetching comments:", err);
    }
  };

  const handleShare = (id) => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${id}`);
    alert("📋 Video link copied to clipboard!");
  };

  return (
    <div
      className={`h-screen overflow-y-scroll snap-y snap-mandatory no-scrollbar
      ${isDark ? "bg-black text-white" : "bg-white text-black"}`}
    >
      {shorts.map((short, index) => {
        const userId = localStorage.getItem("userId");
        const isLiked = short.likes?.includes(userId);

        return (
          <div
            key={short._id}
            className="relative h-screen w-full flex justify-center items-center snap-start"
          >
            {/*  Video */}
            <video
              ref={(el) => (videoRefs.current[index] = el)}
              src={short.videoUrl}
              autoPlay
              playsInline
              loop
              controls={false}
              className="h-[90vh] w-auto max-w-[420px] object-cover rounded-xl shadow-xl"
            />

            {/*  Info */}
            <div className="absolute bottom-24 left-6 max-w-[70%]">
              <h3 className="text-lg font-semibold mb-1 leading-tight">
                {short.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {short.channel?.channelName}
              </p>
            </div>

            {/*  Buttons */}
            <div
              className={`absolute bottom-28 right-6 flex flex-col items-center gap-6 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {/* Like */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleLike(short._id)}
                className="flex flex-col items-center hover:scale-110 transition-transform"
              >
                {isLiked ? (
                  <AiFillHeart
                    size={34}
                    className="text-red-500 transition-transform scale-110"
                  />
                ) : (
                  <AiOutlineHeart size={34} />
                )}
                <p className="text-xs mt-1">{short.likes?.length || 0}</p>
              </motion.button>

              {/* Comments */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => openComments(short._id)}
                className="flex flex-col items-center hover:scale-110 transition-transform"
              >
                <AiOutlineComment size={32} />
                <p className="text-xs mt-1">{short.comments?.length || 0}</p>
              </motion.button>

              {/* Share */}
              <motion.button
                whileTap={{ scale: 0.85 }}
                onClick={() => handleShare(short._id)}
                className="flex flex-col items-center hover:scale-110 transition-transform"
              >
                <AiOutlineShareAlt size={32} />
                <p className="text-xs mt-1">Share</p>
              </motion.button>
            </div>
          </div>
        );
      })}

      {/*  Comments Drawer */}
      <AnimatePresence>
        {activeShort && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3 }}
            className={`fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl shadow-2xl max-h-[70vh] overflow-y-auto ${
              isDark ? "bg-[#181818] text-white" : "bg-white text-black"
            }`}
          >
            {/* Header */}
            <div
              className={`flex justify-between items-center px-4 py-3 border-b ${
                isDark ? "border-gray-700" : "border-gray-300"
              }`}
            >
              <h3 className="font-semibold text-lg">Comments</h3>
              <button
                onClick={() => setActiveShort(null)}
                className="text-gray-500 hover:text-red-500 transition"
              >
                <AiOutlineClose size={22} />
              </button>
            </div>

            {/* Comments List */}
            <div className="p-4 space-y-4">
              {activeShort.comments?.length > 0 ? (
                activeShort.comments.map((c) => (
                  <div
                    key={c._id}
                    className={`border-b pb-3 ${
                      isDark ? "border-gray-700" : "border-gray-300"
                    }`}
                  >
                    <p className="font-medium">{c.user?.username}</p>
                    <p
                      className={`text-sm ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {c.text}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">No comments yet.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Shorts;
