import React from "react";

function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 py-2 bg-white shadow">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        <span className="text-red-600 text-2xl font-bold">YouTube</span>
      </div>

      {/* Middle: Search Bar */}
      <div className="flex flex-1 mx-4">
        <input
          type="text"
          placeholder="Search"
          className="w-full border border-gray-300 rounded-l-full px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button className="bg-gray-100 border border-gray-300 rounded-r-full px-4">
          🔍
        </button>
      </div>

      {/* Right: User/Profile */}
      <div className="flex items-center space-x-4">
        <button className="bg-gray-100 px-3 py-1 rounded-full">Sign In</button>
      </div>
    </header>
  );
}

export default Navbar;
