import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api";

function Register({ setUser }) {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  //  Redirect if already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) navigate("/");
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/auth/register", form);

      // Validate API response
      if (!res?.data || !res.data.token || !res.data.user) {
        throw new Error("Registration failed");
      }

      const { token, user } = res.data;

      // Save to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);

      //  Instantly update parent App state
      if (setUser) setUser(user);

      //  Trigger storage event so Navbar updates immediately (without refresh)
      window.dispatchEvent(new Event("storage"));

      //  Show success toast
      toast.success("Account created successfully! Logging you in...");

      //  Redirect to home
      setTimeout(() => navigate("/"), 800);
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err.response?.data?.error ||
        err.message ||
        "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">
          Create Account
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg mb-4 bg-transparent text-gray-900 dark:text-white"
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg mb-4 bg-transparent text-gray-900 dark:text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 dark:border-gray-700 px-3 py-2 rounded-lg mb-4 bg-transparent text-gray-900 dark:text-white"
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white font-semibold transition-all duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-6 text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-red-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Register;
