import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../Utils";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.email) errs.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = "Email is invalid";
    if (!formData.password) errs.password = "Password is required";
    return errs;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      try{
        const url = "http://localhost:8080/api/auth/login";
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        const result = await response.json();
        console.log(result);
        const { message, token, user } = result;

        if (token && message && user) {
          handleSuccess(message);
          localStorage.setItem("token", token);
          localStorage.setItem("loggedInUser", user.name);
          localStorage.setItem("userEmail", user.email);
          setTimeout(() => {
            navigate("/report");
          }, 1000);
        }
        // Submit registration data to backend API here
        setFormData({ email: "", password: "" });
      }catch(err){
        handleError(err);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transition-transform duration-300 hover:scale-[1.01]">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Welcome Back 👋
        </h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className={`w-full p-3 rounded-lg border text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300"
                }`}
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-500 mt-1 text-sm">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-semibold text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className={`w-full p-3 rounded-lg border text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition 
                ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300"
                }`}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 mt-1 text-sm">{errors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-sky-500 text-white py-3 rounded-lg font-semibold shadow-md 
              hover:from-blue-700 hover:to-sky-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          >
            Login
          </button>

          {/* Footer Text */}
          <p className="text-center text-gray-600 text-sm mt-4">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign Up
            </Link>
          </p>
        </form>

        <ToastContainer position="top-right" autoClose={2000} />
      </div>
    </div>
  );
};

export default Login;
