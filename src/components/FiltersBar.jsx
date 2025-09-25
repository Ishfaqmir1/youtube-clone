import React, { useState } from "react";

const filters = ["All", "Music", "Coding", "Gaming", "News", "Sports", "Movies"];

function FiltersBar({ selected, onSelect }) {
  return (
    <div className="flex overflow-x-auto space-x-3 pb-3 mb-4 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onSelect(filter)}
          className={`px-4 py-2 rounded-full text-sm whitespace-nowrap ${
            selected === filter
              ? "bg-black text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

export default FiltersBar;
