import React from "react";
import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <aside className="w-60 bg-white shadow-md p-4">
      <nav className="space-y-4">
        <Link
          to="/"
          className="block px-3 py-2 rounded hover:bg-gray-200 transition"
        >
          Home
        </Link>
        <Link
          to="/trending"
          className="block px-3 py-2 rounded hover:bg-gray-200 transition"
        >
          Trending
        </Link>
        <Link
          to="/subscriptions"
          className="block px-3 py-2 rounded hover:bg-gray-200 transition"
        >
          Subscriptions
        </Link>
      </nav>
    </aside>
  );
}

export default Sidebar;
