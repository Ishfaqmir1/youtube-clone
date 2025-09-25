import React from "react";
import { useNavigate, Link } from "react-router-dom";

function Profile({ user }) {
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded text-center">
        <h2 className="text-xl font-bold mb-4">You are not logged in</h2>
        <p className="mb-4 text-gray-600">
          Please login or register to view your profile.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Register
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow rounded text-center">
      <img
        src={user.avatar || "https://i.pravatar.cc/100"}
        alt={user.username}
        className="w-24 h-24 rounded-full mx-auto mb-4"
      />
      <h2 className="text-2xl font-bold">{user.username}</h2>
      <p className="text-gray-600">Welcome to your profile!</p>

      <button
        onClick={() => navigate("/")}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Back to Home
      </button>
    </div>
  );
}

export default Profile;
