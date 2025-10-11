import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  MdHomeFilled,
  MdOutlineSubscriptions,
  MdOutlineVideoLibrary,
  MdOutlineWatchLater,
  MdOutlineThumbUp,
  MdHistory,
  MdOutlineDownload,
} from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";

function Sidebar({ collapsed, isOpenMobile, onCloseMobile }) {
  const location = useLocation();

  const sections = [
    {
      links: [
        { to: "/", icon: <MdHomeFilled size={22} />, label: "Home" },
        { to: "/shorts", icon: <SiYoutubeshorts size={22} />, label: "Shorts" },
        {
          to: "/subscriptions",
          icon: <MdOutlineSubscriptions size={22} />,
          label: "Subscriptions",
        },
      ],
    },
    {
      title: "You",
      links: [
        { to: "/history", icon: <MdHistory size={22} />, label: "History" },
        {
          to: "/your-videos",
          icon: <MdOutlineVideoLibrary size={22} />,
          label: "Your Videos",
        },
        {
          to: "/watch-later",
          icon: <MdOutlineWatchLater size={22} />,
          label: "Watch Later",
        },
        {
          to: "/liked",
          icon: <MdOutlineThumbUp size={22} />,
          label: "Liked Videos",
        },
        {
          to: "/downloads",
          icon: <MdOutlineDownload size={22} />,
          label: "Downloads",
        },
      ],
    },
  ];

  const renderLink = ({ to, icon, label }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        key={to}
        to={to}
        onClick={onCloseMobile}
        className={`flex items-center ${
          collapsed ? "justify-center" : "gap-4"
        } px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
          isActive
            ? "bg-gray-200 dark:bg-[#272727] font-semibold"
            : "hover:bg-gray-100 dark:hover:bg-[#272727]"
        }`}
      >
        {icon}
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="p-2 overflow-y-auto h-full no-scrollbar">
      {sections.map((section, i) => (
        <div key={i} className="mb-4">
          {!collapsed && section.title && (
            <div className="text-xs uppercase font-semibold mb-2 px-2 text-gray-500 dark:text-gray-400">
              {section.title}
            </div>
          )}
          <nav className="space-y-1">{section.links.map(renderLink)}</nav>
          {i < sections.length - 1 && (
            <div className="border-b border-gray-200 dark:border-gray-700 my-3"></div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <>
      {/*  Desktop Sidebar (collapsible) */}
      <aside
        className={`fixed top-[56px] left-0 h-[calc(100vh-56px)]
        bg-white dark:bg-[#0f0f0f] text-black dark:text-white
        border-r border-gray-200 dark:border-[#272727]
        transition-[width] duration-300 ease-in-out z-20 hidden md:flex`}
        style={{
          width: collapsed ? "72px" : "240px",
        }}
      >
        {sidebarContent}
      </aside>

      {/*  Mobile Slide-In Sidebar */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onCloseMobile}
          ></div>
          <div
            className="relative w-72 h-full bg-white dark:bg-[#0f0f0f]
              border-r border-gray-200 dark:border-[#272727]
              overflow-y-auto transition-transform duration-300 transform translate-x-0"
          >
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;
