import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMenu, FiSearch, FiMic, FiBell, FiVideo } from "react-icons/fi";

function Navbar({ onToggleSidebar, user, setUser }) {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm}`);
      setSearchTerm("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow sticky top-0 z-50">
      {/* Left: Menu + Logo */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <FiMenu size={22} />
        </button>
        <Link to="/">
          <span className="text-red-600 text-2xl font-bold cursor-pointer">
            YouTube
          </span>
        </Link>
      </div>

      {/* Middle: Search Bar */}
      <form
        onSubmit={handleSearch}
        className="hidden sm:flex flex-1 mx-4 max-w-2xl items-center"
      >
        <input
          type="text"
          placeholder="Search"
          className="w-full border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          type="submit"
          aria-label="Search"
          className="bg-gray-100 border border-gray-300 rounded-r-full px-4 py-2"
        >
          <FiSearch size={20} />
        </button>
        <button
          type="button"
          aria-label="Voice Search"
          className="ml-2 p-2 rounded-full hover:bg-gray-100"
        >
          <FiMic size={20} />
        </button>
      </form>

      {/* Right: Icons + Profile */}
      <div className="flex items-center space-x-4">
        <button
          aria-label="Upload"
          className="p-2 rounded-full hover:bg-gray-100 hidden sm:inline-flex"
        >
          <FiVideo size={22} />
        </button>
        <button
          aria-label="Notifications"
          className="p-2 rounded-full hover:bg-gray-100 hidden sm:inline-flex"
        >
          <FiBell size={22} />
        </button>

        {/* Auth Section */}
        {user ? (
          <div className="relative group">
            <img
              src={user.avatar || "https://i.pravatar.cc/40"}
              alt={user.username}
              className="w-8 h-8 rounded-full cursor-pointer"
            />
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-lg hidden group-hover:block">
              <Link
                to="/profile"
                className="block px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link
              to="/login"
              className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 border border-gray-300 rounded-full text-sm hover:bg-gray-100"
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
