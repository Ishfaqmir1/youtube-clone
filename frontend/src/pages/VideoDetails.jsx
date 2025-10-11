import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import toast from "react-hot-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import VideoCard from "../components/VideoCard";

function VideoDetails() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [relatedVideos, setRelatedVideos] = useState([]);
  const [subscribed, setSubscribed] = useState(false);
  const [subCount, setSubCount] = useState(0);
  const [isOwner, setIsOwner] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  //  Fetch video + subscription state
  const fetchVideo = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/videos/${id}`);
      setVideo(res.data);

      // Fetch related videos
      const related = await API.get(`/videos?category=${res.data.category}`);
      setRelatedVideos(
        related.data.filter((v) => v._id !== res.data._id).slice(0, 8)
      );

      // Fetch channel info
      if (res.data.channel?._id) {
        const channelRes = await API.get(`/channel/${res.data.channel._id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        setSubCount(channelRes.data.subscriberCount || 0);
        setSubscribed(channelRes.data.isSubscribed || false);

        if (currentUser) {
          const uid = String(currentUser._id);
          const ownerId = String(
            channelRes.data.owner?._id || channelRes.data.owner
          );
          setIsOwner(uid === ownerId);
        }
      }
    } catch (err) {
      console.error("Error fetching video:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideo();
    API.post(`/videos/${id}/view`).catch(() => {});
  }, [id]);

  //  Scroll to top on video change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  // Subscribe / Unsubscribe
  const handleSubscribe = async () => {
    if (!currentUser) {
      toast.error("Login required to subscribe");
      return;
    }
    try {
      const res = await API.post(
        `/channel/${video.channel._id}/subscribe`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSubscribed(res.data.subscribed);
      setSubCount(res.data.subscriberCount);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to subscribe");
    }
  };

  //  Like/Dislike Video
  const handleLike = async () => {
    try {
      const res = await API.post(
        `/videos/${id}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVideo(res.data);
    } catch {
      toast.error("Login required to like");
    }
  };

  const handleDislike = async () => {
    try {
      const res = await API.post(
        `/videos/${id}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVideo(res.data);
    } catch {
      toast.error("Login required to dislike");
    }
  };

  //  Add Comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    try {
      const res = await API.post(
        `/comments/${id}`,
        { text: comment },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVideo(res.data);
      setComment("");
      setShowEmojiPicker(false);
    } catch {
      toast.error("Login required to comment");
    }
  };

  //  Edit Comment
  const handleEditSave = async (cid) => {
    try {
      const res = await API.put(
        `/comments/${cid}`,
        { text: editText },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVideo(res.data);
      setEditingId(null);
      setEditText("");
    } catch {
      toast.error("Failed to edit comment");
    }
  };

  // Delete Comment
  const handleDelete = async (cid) => {
    try {
      const res = await API.delete(`/comments/${cid}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setVideo(res.data);
    } catch {
      toast.error("Failed to delete comment");
    }
  };

  //  Like/Dislike Comment
  const handleLikeComment = async (cid) => {
    try {
      const res = await API.post(
        `/comments/${cid}/like`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVideo(res.data);
    } catch {
      toast.error("Login required to like comment");
    }
  };

  const handleDislikeComment = async (cid) => {
    try {
      const res = await API.post(
        `/comments/${cid}/dislike`,
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setVideo(res.data);
    } catch {
      toast.error("Login required to dislike comment");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-60 text-gray-500">
        Loading video...
      </div>
    );

  if (!video)
    return (
      <div className="text-center text-gray-500 mt-10">Video not found</div>
    );

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto p-4 text-gray-900 dark:text-gray-100">
      {/* Left: Main Video */}
      <div className="flex-1">
        {/*  Video Player */}
        <div className="w-full aspect-video bg-black rounded-lg overflow-hidden mb-3">
          <video
            controls
            autoPlay
            playsInline
            src={video.videoUrl}
            className="w-full h-full object-cover"
          />
        </div>

        {/*  Title + Actions */}
        <h1 className="text-lg md:text-xl font-bold mb-2">{video.title}</h1>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4 text-sm">
          <p className="text-gray-500">
            {video.views} views • {new Date(video.createdAt).toDateString()}
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleLike}
              className="flex items-center gap-1 px-3 py-1 border rounded-full hover:bg-gray-100 dark:hover:bg-[#272727]"
            >
              👍 {video.likes?.length || 0}
            </button>
            <button
              onClick={handleDislike}
              className="flex items-center gap-1 px-3 py-1 border rounded-full hover:bg-gray-100 dark:hover:bg-[#272727]"
            >
              👎 {video.dislikes?.length || 0}
            </button>
          </div>
        </div>

        {/*  Channel Info */}
        <div className="flex flex-wrap items-center gap-3 border-t pt-3">
          <Link
            to={`/channel/${video.channel?._id}`}
            className="flex items-center gap-3"
          >
            <img
              src={video.channel?.avatar || "https://via.placeholder.com/50"}
              alt="Channel Avatar"
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h3 className="font-bold">{video.channel?.channelName}</h3>
              <p className="text-gray-500 text-sm">
                {video.channel?.handle} • {subCount} subscribers
              </p>
            </div>
          </Link>

          {!isOwner && (
            <button
              onClick={handleSubscribe}
              className={`ml-auto px-4 py-2 rounded-full text-sm font-semibold text-white transition-all ${
                subscribed
                  ? "bg-gray-500 hover:bg-gray-600"
                  : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>

        {/*  Description */}
        <p className="mt-4 text-gray-700 dark:text-gray-300 whitespace-pre-line">
          {video.description}
        </p>

        {/*  Comments */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-3">
            {video.comments?.length || 0} Comments
          </h2>

          {/* Add Comment */}
          <form onSubmit={handleAddComment} className="flex flex-col gap-2 mb-6 relative">
            <div className="flex gap-2 items-center">
              <input
                type="text"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-1 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowEmojiPicker((p) => !p)}
                className="px-3 py-2 border rounded-full hover:bg-gray-100 dark:hover:bg-[#272727]"
              >
                😀
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
              >
                Post
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute top-12 left-0 z-50">
                <Picker
                  data={data}
                  theme="light"
                  onEmojiSelect={(emoji) =>
                    setComment((prev) => prev + emoji.native)
                  }
                />
              </div>
            )}
          </form>

          {/* Comment List */}
          {video.comments?.map((c) => (
            <div key={c._id} className="mb-4 border-b pb-3">
              <p className="font-semibold">{c.user?.username}</p>
              {editingId === c._id ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="flex-1 border px-2 py-1 rounded"
                  />
                  <button
                    onClick={() => handleEditSave(c._id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <p className="text-gray-700 dark:text-gray-300 mt-1 break-words">
                  {c.text}
                </p>
              )}

              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 flex-wrap">
                <span>{new Date(c.createdAt).toDateString()}</span>
                {c.user?._id === currentUser?._id && (
                  <>
                    <button
                      onClick={() => {
                        setEditingId(c._id);
                        setEditText(c.text);
                      }}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(c._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => handleLikeComment(c._id)}
                  className="hover:underline"
                >
                  👍 {c.likes?.length || 0}
                </button>
                <button
                  onClick={() => handleDislikeComment(c._id)}
                  className="hover:underline"
                >
                  👎 {c.dislikes?.length || 0}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Suggested Videos */}
      <div className="w-full lg:w-80 flex-shrink-0">
        <h3 className="text-lg font-semibold mb-3">Suggested Videos</h3>
        <div className="flex flex-col gap-3">
          {relatedVideos.map((rv) => (
            <VideoCard key={rv._id} video={rv} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoDetails;
