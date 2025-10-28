import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const islogged = localStorage.getItem("token");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-1/2 transform -translate-x-1/2 w-full md:w-[90%] z-[9999] px-6 py-3 transition-all duration-500 ease-in-out
        ${scrolled
          ? "backdrop-blur-md bg-white/30 shadow-md rounded-3xl mt-4"
          : "bg-transparent shadow-none rounded-none mt-0"
        }`}
    >
      <div className="flex justify-between items-center">
        {/* Logo + Brand */}
        <div className="flex items-center gap-4">
          <img src={logo} alt="CivicTrack Logo" className="h-12 w-12" />
          <Link
            to="/"
            className="text-2xl font-bold text-black transition-colors duration-300"
          >
            Civic Track
          </Link>
        </div>

        {/* Hamburger for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="focus:outline-none text-black"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Menu Links */}
        <div
          className={`flex-col md:flex md:flex-row md:space-x-6 absolute md:static bg-transparent w-max md:w-auto top-16 md:top-auto right-4 md:right-0 transition-all duration-300 ease-in-out ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          {role === "admin" ? (
            <Link
              to="/admin/dashboard"
              onClick={() => setIsOpen(false)}
              className="block px-4 py-2 font-semibold text-black hover:text-blue-700"
            >
              Admin Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 font-semibold text-black hover:text-blue-700"
              >
                Home
              </Link>
              <Link
                to="/report"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 font-semibold text-black hover:text-blue-700"
              >
                Report Issue
              </Link>

              {islogged ? (
                <Link
                  to="/user/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 font-semibold text-black hover:text-blue-700"
                >
                  User Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 font-semibold text-black hover:text-blue-700"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-2 font-semibold text-black hover:text-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
