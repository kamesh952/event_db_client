import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { FaBars } from "react-icons/fa";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import EditEventPage from "./pages/EditEventPage";
import EventsPage from "./pages/EventsPage";
import MyBookingsPage from "./pages/MyBookingsPage";
import CreateEventPage from "./pages/CreateEventPage";
import ProfilePage from "./pages/ProfilePage";
import Sidebar from "./pages/Sidebar";
import userIcon from "./assets/user_icon.png";
import axios from "axios";
import { Link } from "react-router-dom";

import EventDetailsPage from "./pages/EventDetailPage";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);

  // Fetch user data when token changes
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get("/api/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  const handleProfileClick = async () => {
    if (!profileDropdownOpen) {
      setLoadingProfile(true);
      try {
        await fetchUserProfile();
      } finally {
        setLoadingProfile(false);
      }
    }
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setProfileDropdownOpen(false);
  };

  return (
    <Router>
      {token ? (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
          {/* Sidebar with overlay on mobile */}
          {sidebarOpen && (
            <div
              className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            onLogout={handleLogout}
            user={user}
          />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Fixed Navbar */}
            <div className="bg-white shadow-sm z-20">
              <div className="flex items-center justify-between px-5 py-4">
                <div className="flex items-center">
                  <button
                    className="mr-4 text-gray-500 focus:outline-none lg:hidden"
                    onClick={toggleSidebar}
                  >
                    <FaBars size={20} />
                  </button>

                  <h2
                    className="text-4xl tracking-wide"
                    style={{ fontFamily: "'Great Vibes', cursive" }}
                  >
                    EventHub
                  </h2>
                </div>

                <div className="flex items-center relative">
                  <button
                    onClick={handleProfileClick}
                    className="flex items-center focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {user ? (
                        user.profileImage ? (
                          <img
                            src={user.profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-700 font-medium">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        )
                      ) : (
                        <img
                          src={userIcon}
                          alt="User"
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    {loadingProfile && (
                      <span className="ml-2 text-sm">Loading...</span>
                    )}
                  </button>

                  {/* Profile Dropdown */}
                  {profileDropdownOpen && (
                    <div className="absolute right-0 top-12 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b">
                        <p className="text-sm font-medium text-gray-800">
                          {user?.name}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {user?.email}
                        </p>
                      </div>
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Your Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              <main className="p-4">
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/create" element={<CreateEventPage />} />
                  <Route path="/events/:id/edit" element={<EditEventPage />} />
                  <Route path="/my-bookings" element={<MyBookingsPage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  <Route
                    path="/profile"
                    element={
                      <ProfilePage
                        user={user}
                        setUser={setUser}
                        token={token}
                        fetchUserProfile={fetchUserProfile}
                      />
                    }
                  />
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                </Routes>
              </main>
            </div>
          </div>
        </div>
      ) : (
        <Routes>
          <Route
            path="/login"
            element={<AuthPage setToken={setToken} isLogin={true} />}
          />
          <Route
            path="/register"
            element={<AuthPage setToken={setToken} isLogin={false} />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
