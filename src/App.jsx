import React from 'react'
import{Routes,Route} from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Trending from './pages/Trending';
import Subscriptions from './pages/Subscriptions';
import VideoDetail from './pages/VideoDetails';

function App() {
  return (
      <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 bg-gray-100 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/subscriptions" element={<Subscriptions />} />
            <Route path="/video/:id" element={<VideoDetail />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App
