import React, { useEffect, useState } from "react";
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
import Channel from "./pages/Channel";
import Upload from "./pages/Upload";
import ProtectedRoute from "./components/ProtectedRoute";
import ChannelPage from "./pages/ChannelPage";
import Shorts from "./pages/Shorts";
import { Toaster } from "react-hot-toast";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpenMobile, setSidebarOpenMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  //  Apply theme globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  // Sidebar toggle logic (Desktop vs Mobile)
  const handleSidebarToggle = () => {
    if (window.innerWidth < 768) {
      // Mobile sidebar open/close
      setSidebarOpenMobile((prev) => !prev);
    } else {
      // Desktop collapse toggle
      setSidebarCollapsed((prev) => !prev);
    }
  };

  //  Restore logged-in user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  //  Auto-sync user state across Register/Login/Logout 
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-[#0f0f0f]">
      {/*  Toast Notifications */}
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

      {/*  Fixed Navbar */}
      <Navbar
        onToggleSidebar={handleSidebarToggle}
        user={user}
        setUser={setUser}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Page layout below Navbar */}
      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <Sidebar
          collapsed={sidebarCollapsed}
          isOpenMobile={sidebarOpenMobile}
          onCloseMobile={() => setSidebarOpenMobile(false)}
        />

        {/*  Main Content Area */}
        <main
          className={`flex-1 overflow-y-auto transition-[padding] duration-300 ease-in-out pt-[56px]
          bg-gray-100 dark:bg-[#0f0f0f]
          ${sidebarCollapsed ? "md:pl-[72px]" : "md:pl-[240px]"}`}
        >
          <Routes>
            <Route
              path="/"
              element={<Home sidebarCollapsed={sidebarCollapsed} />}
            />
            <Route path="/trending" element={<Trending />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/video/:id" element={<VideoDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/shorts" element={<Shorts />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register setUser={setUser} />} />

            {/* Protected Routes */}
            <Route
              path="/create-channel"
              element={
                <ProtectedRoute user={user}>
                  <Channel />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute user={user}>
                  <Profile user={user} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/upload"
              element={
                <ProtectedRoute user={user}>
                  <Upload user={user} />
                </ProtectedRoute>
              }
            />
            <Route path="/channel/:id" element={<ChannelPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
