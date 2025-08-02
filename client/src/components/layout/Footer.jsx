import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -top-32 -left-32 animate-pulse" />
        <div
          className="absolute w-48 h-48 bg-purple-500/10 rounded-full blur-2xl -bottom-24 -right-24 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute w-32 h-32 bg-cyan-500/10 rounded-full blur-xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{ animationDuration: "4s" }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
                🏙️ Ahmedabad Career Hub
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Empowering Ahmedabad's talent with cutting-edge career
                opportunities and authentic industry insights.
              </p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              <a
                href="https://linkedin.com/in/aashish-parmar-65ba57295/"
                target="_blank"
                className="group p-3 bg-white/10 rounded-full hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-5 h-5 text-blue-400 group-hover:text-blue-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com/in/aashish-parmar-65ba57295/"
                target="_blank"
                className="group p-3 bg-white/10 rounded-full hover:bg-blue-500/20 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-5 h-5 text-blue-400 group-hover:text-blue-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 rounded-full hover:bg-purple-500/20 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-5 h-5 text-purple-400 group-hover:text-purple-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
              <a
                href="#"
                className="group p-3 bg-white/10 rounded-full hover:bg-red-500/20 transition-all duration-300 hover:scale-110"
              >
                <svg
                  className="w-5 h-5 text-red-400 group-hover:text-red-300"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641.001 12.017.001z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-blue-300">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/jobs"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Browse Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/companies"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Companies
                </Link>
              </li>
              <li>
                <Link
                  to="/submit-interview"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Interview Experiences
                </Link>
              </li>
              <li>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-blue-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-purple-300">
              For Students
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/register"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Create Account
                </Link>
              </li>
              <li>
                <Link
                  to="/profile"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Build Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/applications"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Track Applications
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-purple-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Career Resources
                </a>
              </li>
            </ul>
          </div>

          {/* For Recruiters */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-cyan-300">
              For Recruiters
            </h4>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/post-job"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Post Jobs
                </Link>
              </li>
              <li>
                <Link
                  to="/recruiter-dashboard"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Recruiter Dashboard
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Talent Pool
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-gray-300 hover:text-cyan-400 transition-colors duration-200 flex items-center group"
                >
                  <span className="mr-2 transform group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                  Pricing Plans
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        {/* <div className="border-t border-white/10 pt-12 mb-12">
          <div className="max-w-2xl mx-auto text-center">
            <h4 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Stay Updated with Latest Opportunities
            </h4>
            <p className="text-gray-300 mb-6">
              Get weekly job alerts, interview tips, and career insights delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-600 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                Subscribe 📧
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              &copy; {currentYear} Ahmedabad Career Hub. All rights reserved.
              Built with ❤️ for Ahmedabad's talent.
            </div>
            <div className="flex flex-wrap justify-center md:justify-end space-x-6 text-sm">
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                Contact Us
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
              >
                Help Center
              </a>
            </div>
          </div>
        </div>

        {/* Floating "Back to Top" indicator */}
        <div className="absolute top-4 right-4 opacity-50">
          <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center animate-bounce">
            <svg
              className="w-4 h-4 text-blue-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
