import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Some animated gradients and shimmer styles
const styles = `
@keyframes navbarFadeIn { 0% {opacity:0;transform:translateY(-24px);} 100% {opacity:1; transform:translateY(0);} }
.animate-navbar { animation: navbarFadeIn 0.7s cubic-bezier(.45, .9, .4, 1.25) both; }
.glass-nav-bg {
  background: rgba(255,255,255,0.85);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow: 0 6px 20px 0 #7ddaff26;
}
.nav-gradient-line {
  background: linear-gradient(90deg,#3b82f6 0%, #06b6d4 50%, #818cf8 100%);
  height: 3px;
  width: 100%;
  position: absolute;
  left: 0; bottom: -3px;
  border-radius: 2px;
  opacity: 0.44;
  animation: navPulse 3.5s infinite cubic-bezier(.6,.17,.94,.48);
}
@keyframes navPulse {
  0%, 100% { opacity: .44;}
  50% {opacity: .86;}
}
@media (max-width: 640px) {
  .nav-hide-sm { display: none !important; }
}
`;

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close menu on navigation
  const handleNavClick = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-40">
      <style>{styles}</style>
      <nav
        className="relative animate-navbar glass-nav-bg px-2 sm:px-7 py-2 flex justify-between items-center shadow-sm transition-all duration-700"
        style={{
          borderBottom: "1.5px solid #ecfeff55",
        }}
      >
        {/* Logo + Brand */}
        <div className="flex items-center gap-2">
          {/* Optional: Animated or static logo */}
          <div className="h-9 w-9 bg-gradient-to-tr from-blue-400 to-cyan-300 rounded-full flex items-center justify-center text-2xl font-black text-white shadow-lg border-2 border-blue-400 animate-[spin_9s_linear_infinite] nav-hide-sm">
            {/* 🔷 or SVG logo here */}
            <span className="drop-shadow">A</span>
          </div>
          <Link
            to="/"
            className="text-2xl md:text-2xl font-black text-blue-700 tracking-tight hover:text-blue-800 transition-colors flex items-center gap-2"
            onClick={handleNavClick}
          >
            Ahmedabad <span className="text-cyan-500">Career Hub</span>
          </Link>
        </div>

        {/* Hamburger menu for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-10 h-10 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          aria-label="Toggle navigation menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span
            className={`block w-6 h-0.5 bg-blue-700 mb-1 transition-transform duration-200 ${
              menuOpen ? "rotate-45 translate-y-1.5" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-blue-700 mb-1 transition-opacity duration-200 ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block w-6 h-0.5 bg-blue-700 transition-transform duration-200 ${
              menuOpen ? "-rotate-45 -translate-y-1.5" : ""
            }`}
          ></span>
        </button>

        {/* Nav Links */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row gap-2 sm:gap-4 items-center text-[1rem] absolute sm:static top-full left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow sm:shadow-none z-30 sm:z-auto transition-all duration-300 ${
            menuOpen ? "py-4 px-2 border-b border-blue-100" : ""
          }`}
        >
          <Link
            to="/companies"
            className="relative group font-medium py-1 px-2 hover:text-cyan-600 transition-colors duration-200"
            onClick={handleNavClick}
          >
            Companies
            <span className="nav-gradient-line group-hover:opacity-100" />
          </Link>
          <Link
            to="/jobs"
            className="relative group font-medium py-1 px-2 hover:text-blue-600 transition-colors duration-200"
            onClick={handleNavClick}
          >
            Jobs
            <span className="nav-gradient-line group-hover:opacity-100" />
          </Link>
          {isLoggedIn ? (
            <>
              {user?.role === "recruiter" && (
                <>
                  {user?.company ? (
                    <Link
                      to="/my-company"
                      className="relative group font-medium py-1 px-2 text-purple-700 hover:text-purple-900 transition-colors duration-200"
                      onClick={handleNavClick}
                    >
                      My Company
                      <span className="nav-gradient-line group-hover:opacity-100" />
                    </Link>
                  ) : (
                    <Link
                      to="/create-company"
                      className="relative group font-medium py-1 px-2 text-yellow-700 hover:text-yellow-900 transition-colors duration-200"
                      onClick={handleNavClick}
                    >
                      Create Company
                      <span className="nav-gradient-line group-hover:opacity-100" />
                    </Link>
                  )}
                  {user?.company && (
                    <Link
                      to="/post-job"
                      className="relative group font-medium py-1 px-2 text-green-700 hover:text-green-900 transition-colors duration-200"
                      onClick={handleNavClick}
                    >
                      Post Job
                      <span className="nav-gradient-line group-hover:opacity-100" />
                    </Link>
                  )}
                </>
              )}
              <Link
                to="/Dashboard"
                className="relative group flex items-center gap-2 font-medium px-2 py-1 hover:text-blue-700 transition-colors duration-200"
                onClick={handleNavClick}
              >
                {/* Avatar or initial, with clickable highlight */}
                {user?.avatarUrl ? (
                  <span className="flex items-center">
                    <img
                      src={user.avatarUrl}
                      alt="avatar"
                      className="w-7 h-7 rounded-full object-cover border-2 border-blue-200 shadow-sm transition-transform group-hover:scale-110"
                    />
                  </span>
                ) : (
                  <span className="w-7 h-7 rounded-full bg-blue-200 text-blue-900 border-2 border-white shadow-inner flex items-center justify-center font-bold transition group-hover:scale-110 duration-200">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                )}
                {/* On hover underline */}
                <span className="relative">
                  My Profile
                  <span className="nav-gradient-line group-hover:opacity-100" />
                </span>
              </Link>
              <button
                onClick={() => {
                  logout();
                  handleNavClick();
                }}
                className="ml-2 text-red-500 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 hover:text-red-700 transition-all duration-150"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="group px-2 py-1 font-medium hover:text-blue-600 transition-colors"
                onClick={handleNavClick}
              >
                Login
                <span className="nav-gradient-line group-hover:opacity-100" />
              </Link>
              <Link
                to="/register"
                className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white font-semibold shadow hover:from-blue-700 hover:to-cyan-600 transform-gpu hover:scale-105 transition-all duration-200 ml-2"
                onClick={handleNavClick}
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Animated gradient line at bottom */}
        <span className="absolute left-0 right-0 bottom-0 h-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-300 opacity-60 rounded-l-3xl rounded-r-3xl blur-[1.5px] pointer-events-none z-0" />
      </nav>
    </header>
  );
};

export default Navbar;
