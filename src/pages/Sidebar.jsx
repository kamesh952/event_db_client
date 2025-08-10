import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaCalendarAlt,
  FaTicketAlt,
  FaSignOutAlt,
  FaTimes,
  FaUser,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = ({ isOpen, onToggle, onLogout, user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isThin = !isExpanded && !isOpen;

  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: FaHome },
    { name: "All Events", path: "/events", icon: FaCalendarAlt },
    { name: "My Bookings", path: "/my-bookings", icon: FaTicketAlt },
    { name: "My Profile", path: "/profile", icon: FaUser },
  ];

  const isActivePath = (path) => location.pathname === path;

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={onToggle}
        ></div>
      )}

      <div
        className={`
          bg-gray-900 text-gray-100
          fixed lg:relative h-full z-30 flex flex-col
          transform ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 transition-all duration-300 ease-in-out
          shadow-xl lg:shadow-none
          ${isOpen ? "w-64" : isExpanded ? "lg:w-64" : "lg:w-20"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {(isOpen || isExpanded) && (
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="EventHub Logo"
                className="w-10 h-10 object-contain"
              />
              <h2 className="text-1xl font-bold tracking-wide text-white">
                EventHub
              </h2>
            </div>
          )}

          <div className="flex items-center space-x-2">
            {!isThin && (
              <button
                onClick={() => setIsExpanded(false)}
                className="hidden lg:flex p-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <FaChevronLeft className="w-4 h-4" />
              </button>
            )}
            {isThin && (
              <button
                onClick={() => setIsExpanded(true)}
                className="hidden lg:flex p-2 rounded-md hover:bg-gray-800 transition-colors"
              >
                <FaChevronRight className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-md hover:bg-gray-800 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 mt-3 space-y-1">
          {menuItems.map(({ name, path, icon: Icon }) => {
            const isActive = isActivePath(path);
            return (
              <Link
                key={name}
                to={path}
                onClick={() => {
                  if (window.innerWidth < 1024) onToggle?.();
                }}
                className={`
                  flex items-center ${
                    isExpanded || isOpen ? "justify-start" : "justify-center"
                  }
                  ${isThin ? "px-2 py-3" : "px-3 py-3"}
                  rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "bg-blue-700 text-white shadow-sm scale-[0.98]"
                      : "text-gray-300 hover:text-white hover:bg-gray-800 hover:scale-[0.98]"
                  }
                  group relative
                `}
              >
                <Icon
                  className={`${
                    isThin ? "w-5 h-5" : "w-5 h-5 mr-3"
                  } transition-colors`}
                />
                {(isExpanded || isOpen) && (
                  <span className="font-medium text-sm">{name}</span>
                )}
                {isThin && (
                  <span className="absolute left-full ml-2 w-max px-2 py-1 text-sm bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {name}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-gray-700 mt-auto space-y-1">
          {user && (
            <div
              className={`p-4 border-b border-gray-700 ${
                isThin ? "flex justify-center" : ""
              }`}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-700 flex items-center justify-center text-white">
                  {user.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
                </div>
                {(isOpen || isExpanded) && (
                  <div className="ml-3">
                    <p className="text-sm font-medium truncate max-w-[160px] text-white">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-400 truncate max-w-[160px]">
                      {user.email}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className={`
              flex items-center ${
                isExpanded || isOpen ? "justify-start" : "justify-center"
              }
              w-full ${isThin ? "px-2 py-3" : "px-3 py-3"}
              text-red-400 hover:text-red-500 hover:bg-red-900/30 rounded-lg
              transition-all duration-200 group hover:scale-[0.98]
            `}
          >
            <FaSignOutAlt
              className={`${isThin ? "w-5 h-5" : "w-5 h-5 mr-3"}`}
            />
            {(isExpanded || isOpen) && (
              <span className="font-medium text-sm">Logout</span>
            )}
            {isThin && (
              <span className="absolute left-full ml-2 w-max px-2 py-1 text-sm bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Logout
              </span>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
