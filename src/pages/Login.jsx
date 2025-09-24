import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!username.trim()) return alert("Please enter a username");

    // Fake login user object
    const newUser = {
      username,
      avatar: `https://i.pravatar.cc/150?u=${username}`, // unique avatar
    };

    // Save to localStorage + update state
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);

    navigate("/"); // redirect home
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-80"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
