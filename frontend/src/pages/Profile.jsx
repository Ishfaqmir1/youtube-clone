// src/pages/Profile.jsx
import React, { useEffect, useState } from "react";
import API from "../api";
import VideoCard from "../components/VideoCard";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/me", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(res.data);
      } catch (err) {
        console.error("Error loading profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!profile) return <p className="text-center mt-6">Loading profile...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white shadow p-4 rounded mb-6">
        <h1 className="text-2xl font-bold">{profile.user.username}</h1>
        <p className="text-gray-600">{profile.user.email}</p>
      </div>

      <h2 className="text-xl font-semibold mb-3">Your Videos</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {profile.videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}

export default Profile;
