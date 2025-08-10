import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

const AuthPage = ({ setToken, isLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: 'demo@example.com',
    password: 'password123'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? `${API_BASE_URL}/api/login` : `${API_BASE_URL}/api/register`;
      const body = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Authentication failed');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      
      if (isLogin) {
        navigate('/dashboard');
      } else {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };         


  const authImage = isLogin 
    ? "https://www.brides.com/thmb/JcdtVSFkiDT_FojuI32P0SQlrss=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/37-redwoods-outdoor-chapel-wedding-reception-dance-floor-ryan-ray-0524-65f65fcbd02f49e789f42482b59e8749.JPG" 
    : "https://images.unsplash.com/photo-1587271407850-8d438ca9fdf2?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMGhhbGx8ZW58MHx8MHx8fDA%3D";

  return (
    <div 
      className="min-h-screen w-full bg-[#1e1b4b] flex items-center justify-center overflow-x-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <div className="flex flex-col lg:flex-row w-full min-h-screen text-white">
        {/* Left Image Panel - Hidden on mobile and tablet */}
        {isLogin && (
          <div className="hidden lg:flex w-1/2 relative">
            <img
              src={authImage}
              alt="Login visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 sm:top-8 left-4 sm:left-8 text-white text-xl sm:text-2xl font-bold">
              EventHub
            </div>
            <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 text-lg sm:text-xl font-medium">
              Welcome Back,
              <br />
              Let's get started
            </div>
          </div>
        )}

        {/* Form Container - Full width on mobile/tablet, half on desktop */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#2e2b5f] p-4 sm:p-6 md:p-8 lg:p-10 min-h-screen lg:min-h-0">
          <div className="w-full max-w-sm sm:max-w-md bg-[#2e2b5f] shadow-2xl rounded-2xl p-6 sm:p-8">
            {/* Title */}
            <div className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-purple-300 mb-4 sm:mb-6 tracking-wider">
              EventHub
            </div>

            <p className="text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <span
                className="text-purple-400 hover:underline cursor-pointer"
                onClick={() => navigate(isLogin ? "/register" : "/login")}
              >
                {isLogin ? "Register" : "Log in"}
              </span>
            </p>

            {error && (
              <div className="text-red-400 text-xs sm:text-sm mb-4 p-2 bg-red-900/20 rounded">
                {error}
              </div>
            )}
            {success && (
              <div className="text-green-400 text-xs sm:text-sm mb-4 p-2 bg-green-900/20 rounded">
                Registration successful! Redirecting to login...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-[#3f3cbb] text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
                />
              )}
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#3f3cbb] text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="6"
                className="w-full bg-[#3f3cbb] text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm sm:text-base"
              />

              {!isLogin && (
                <label className="flex items-start sm:items-center text-xs sm:text-sm text-gray-300 leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    className="mr-2 mt-1 sm:mt-0 accent-purple-500 flex-shrink-0"
                  />
                  <span>
                    I agree to the{" "}
                    <span
                      onClick={() => setShowModal(true)}
                      className="underline text-purple-400 cursor-pointer"
                    >
                      Terms & Conditions
                    </span>
                  </span>
                </label>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 transition duration-300 text-white font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base disabled:opacity-50"
              >
                {loading ? 'Processing...' : isLogin ? 'Login' : 'Create account'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Image for Register - Hidden on mobile and tablet */}
        {!isLogin && (
          <div className="hidden lg:flex w-1/2 relative">
            <img
              src={authImage}
              alt="Register visual"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 sm:top-8 right-4 sm:right-8 text-white text-xl sm:text-2xl font-bold">
              EventHub
            </div>
            <div className="absolute bottom-4 sm:bottom-8 right-4 sm:right-8 text-lg sm:text-xl font-medium text-right">
              Join Our Community,
              <br />
              Start Your Journey
            </div>
          </div>
        )}

        {/* Modal for Terms & Conditions */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] p-4 sm:p-6 text-black relative">
              <h2 className="text-lg sm:text-xl font-bold mb-4 pr-8">
                Terms & Conditions
              </h2>
              <div className="h-48 sm:h-64 overflow-y-auto text-xs sm:text-sm space-y-2 pr-2">
                <p>
                  These Terms and Conditions govern your use of this
                  application. By registering or logging in, you agree to comply
                  with them.
                </p>
                <p>
                  1. All user information must be accurate and up to date.
                  <br />
                  2. Do not share your account credentials with others.
                  <br />
                  3. Admins reserve the right to revoke access at any time.
                  <br />
                  4. You consent to the collection of your activity data for
                  security and analytics purposes.
                </p>
                <p>
                  For more details, contact the administrator. Your use of the
                  platform constitutes acceptance of these terms.
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-2 sm:top-3 right-3 sm:right-4 text-xl sm:text-2xl font-bold text-gray-700 hover:text-black p-1"
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPage;