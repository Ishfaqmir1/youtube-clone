import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Trending from "./pages/Trending";
import Subscriptions from "./pages/Subscriptions";
import VideoDetail from "./pages/VideoDetails";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Upload from "./pages/Upload";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);

  // Load user from localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <Navbar
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        user={user}
        setUser={setUser}
      />
      <div className="flex flex-1">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/profile" element={<Profile user={user} />} />
            <Route path="/upload" element={<Upload user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
