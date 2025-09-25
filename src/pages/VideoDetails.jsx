// src/pages/VideoDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import ReactPlayer from "react-player";

const VideoDetails = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await API.get(`/videos/${id}`);
        setVideo(res.data);
        setComments(res.data.comments || []);
      } catch (err) {
        console.error("Error fetching video:", err);
      }
    };
    fetchVideo();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await API.post(`/videos/${id}/like`);
      setVideo(res.data);
    } catch (err) {
      console.error("Error liking video:", err);
    }
  };

  const handleDislike = async () => {
    try {
      const res = await API.post(`/videos/${id}/dislike`);
      setVideo(res.data);
    } catch (err) {
      console.error("Error disliking video:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await API.post(`/videos/${id}/comments`, { text: newComment });
      setComments([...comments, res.data]);
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await API.delete(`/videos/${id}/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  if (!video) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <ReactPlayer url={video.videoUrl} width="100%" controls />
      <h1 className="text-2xl font-bold mt-3">{video.title}</h1>
      <p className="text-gray-600">{video.channelName}</p>
      <p className="mb-3">{video.views} views</p>

      {/* Like/Dislike buttons */}
      <div className="flex gap-4 mb-4">
        <button
          onClick={handleLike}
          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
        >
          👍 Like ({video.likes || 0})
        </button>
        <button
          onClick={handleDislike}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          👎 Dislike ({video.dislikes || 0})
        </button>
      </div>

      {/* Comments Section */}
      <h2 className="text-xl font-semibold mb-2">Comments</h2>
      <div className="mb-4 flex gap-2">
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-1 border px-3 py-2 rounded"
        />
        <button
          onClick={handleAddComment}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Post
        </button>
      </div>

      <ul>
        {comments.map((c) => (
          <li
            key={c._id}
            className="border-b py-2 flex justify-between items-center"
          >
            <span>{c.text}</span>
            <button
              onClick={() => handleDeleteComment(c._id)}
              className="text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VideoDetails;
