import { memo, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiMenu,
  FiSearch,
  FiBell,
  FiVideo,
  FiMic,
  FiSun,
  FiMoon,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import API from "../api";

const Navbar = memo(({ onToggleSidebar, user, setUser, theme, toggleTheme }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const navigate = useNavigate();
  const modalRef = useRef();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setShowProfileModal(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout user
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setShowProfileModal(false);
    navigate("/login");
  };

  // Search submit handler
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${searchQuery}`);
      setSearchQuery("");
    }
  };

  // View Channel handler
  const handleViewChannel = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.channel?._id) navigate(`/channel/${res.data.channel._id}`);
      else navigate("/create-channel");

      setShowProfileModal(false);
    } catch (err) {
      console.error("Error fetching user channel:", err);
      navigate("/login");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 py-2 z-50 bg-white dark:bg-[#0f0f0f] border-b border-gray-200 dark:border-[#272727] shadow-sm">
      {/*  Left Section: Hamburger + Logo */}
      <div className="flex items-center space-x-3">
        {/*  Hamburger */}
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <FiMenu size={22} />
        </button>

        <Link to="/" className="flex items-center">
          <svg viewBox="0 0 28 20" width="28" height="20" className="block">
            <rect width="28" height="20" rx="4" fill="#FF0000" />
            <path d="M11 5 L19 10 L11 15 Z" fill="#FFF" />
          </svg>
          <span className="hidden sm:inline-flex text-[18px] font-semibold ml-[4px]">
            YouTube
            <span className="text-[10px] font-normal text-gray-500 ml-[3px] -translate-y-[2px]">
              IN
            </span>
          </span>
        </Link>
      </div>

      {/*  Middle Section: Search + Mic */}
      <div className="hidden sm:flex flex-1 justify-center max-w-2xl mx-4">
        <form onSubmit={handleSearchSubmit} className="flex w-full">
          <input
            type="text"
            placeholder="Search"
            className="w-full border border-gray-300 dark:border-gray-700 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500 dark:bg-[#121212] dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gray-100 dark:bg-[#272727] border border-gray-300 dark:border-gray-700 rounded-r-full px-4 py-2 hover:bg-gray-200 dark:hover:bg-[#3a3a3a]"
          >
            <FiSearch size={20} />
          </button>
        </form>

        <button className="ml-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <FiMic size={22} />
        </button>
      </div>

      {/*  Right Section: Upload, Notifications, Theme, Profile */}
      <nav className="flex items-center space-x-3">
        {user && (
          <>
            <Link
              to="/upload"
              className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <FiVideo size={22} />
            </Link>
            <button className="hidden sm:inline-flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <FiBell size={22} />
            </button>
          </>
        )}

        {/* 🔹 Profile / Sign In Button */}
        {user ? (
          <div className="relative" ref={modalRef}>
            <div
              onClick={() => setShowProfileModal((s) => !s)}
              className="w-9 h-9 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer font-semibold"
            >
              {(user.username || "U").charAt(0).toUpperCase()}
            </div>

            {showProfileModal && (
              <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#1f1f1f] border dark:border-[#333] rounded-xl shadow-lg z-50">
                {/* User info */}
                <div className="p-4 border-b dark:border-[#333]">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                      {(user.username || "U").charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {user.username}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {user.email}
                      </p>
                      <button
                        onClick={handleViewChannel}
                        className="text-blue-600 text-sm font-medium hover:underline"
                      >
                        View your channel
                      </button>
                    </div>
                  </div>
                </div>

                {/* Settings */}
                <div className="py-2">
                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                  >
                    {theme === "dark" ? <FiSun /> : <FiMoon />}
                    <span>
                      Appearance: {theme === "dark" ? "Dark" : "Light"}
                    </span>
                  </button>

                  <Link
                    to="/settings"
                    onClick={() => setShowProfileModal(false)}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm flex items-center gap-2"
                  >
                    <FiUser /> Settings
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm text-red-600 flex items-center gap-2"
                  >
                    <FiLogOut /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            className="px-4 py-1 border border-gray-300 dark:border-gray-700 rounded-full text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => navigate("/login")}
          >
            Sign in
          </button>
        )}
      </nav>
    </header>
  );
});

export default Navbar;
