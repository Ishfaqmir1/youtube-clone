import React from "react";
import { Link } from "react-router-dom";
import {
  FiHome,
  FiPlayCircle,
  FiClock,
  FiHeart,
  FiTrendingUp,
  FiShoppingBag,
  FiMusic,
  FiFilm,
  FiBookOpen,
  FiTv,
} from "react-icons/fi";
import { MdSubscriptions, MdHistory, MdOutlineSportsSoccer } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";

function Sidebar() {
  return (
    <aside className="w-56 bg-white border-r h-screen overflow-y-auto p-4 hidden md:block">
      {/* Main Navigation */}
      <nav className="space-y-2">
        <Link to="/" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
          <FiHome size={20} /> <span>Home</span>
        </Link>
        <Link to="/shorts" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
          <SiYoutubeshorts size={20} /> <span>Shorts</span>
        </Link>
        <Link to="/subscriptions" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
          <MdSubscriptions size={20} /> <span>Subscriptions</span>
        </Link>
      </nav>

      {/* Divider */}
      <hr className="my-4" />

      {/* Library Section */}
      <div>
        <h2 className="text-sm font-semibold mb-2 px-2">You</h2>
        <nav className="space-y-2">
          <Link to="/history" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <MdHistory size={20} /> <span>History</span>
          </Link>
          <Link to="/playlists" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <FiPlayCircle size={20} /> <span>Playlists</span>
          </Link>
          <Link to="/watch-later" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <FiClock size={20} /> <span>Watch later</span>
          </Link>
          <Link to="/liked" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <FiHeart size={20} /> <span>Liked videos</span>
          </Link>
        </nav>
      </div>

      {/* Divider */}
      <hr className="my-4" />

      {/* Explore Section */}
      <div>
        <h2 className="text-sm font-semibold mb-2 px-2">Explore</h2>
        <nav className="space-y-2">
          <Link to="/trending" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <FiTrendingUp size={20} /> <span>Trending</span>
          </Link>
          <Link to="/shopping" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <FiShoppingBag size={20} /> <span>Shopping</span>
          </Link>
          <Link to="/music" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <FiMusic size={20} /> <span>Music</span>
          </Link>
          <Link to="/movies" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <FiFilm size={20} /> <span>Movies</span>
          </Link>
          <Link to="/news" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <FiBookOpen size={20} /> <span>News</span>
          </Link>
          <Link to="/sports" className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100">
            <MdOutlineSportsSoccer size={20} /> <span>Sports</span>
          </Link>
        </nav>
      </div>
    </aside>
  );
}

export default Sidebar;
