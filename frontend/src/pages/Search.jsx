// src/pages/Search.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import API from "../api";
import VideoCard from "../components/VideoCard";

function Search() {
  const [results, setResults] = useState([]);
  const query = new URLSearchParams(useLocation().search).get("q");

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await API.get(`/videos?q=${query}`);
        setResults(res.data);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };
    if (query) fetchResults();
  }, [query]);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">
        Search Results for: {query}
      </h1>
      {results.length === 0 ? (
        <p>No videos found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Search;
