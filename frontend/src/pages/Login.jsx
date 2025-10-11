import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import API from "../api";

function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Redirect if already logged in
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      navigate("/"); // redirect to home
    }
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const res = await API.post("/auth/login", form);

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    localStorage.setItem("userId", res.data.user._id); // ✅ store userId separately

    setUser(res.data.user);
    toast.success("Login successful!");
    navigate("/");
  } catch (err) {
    const msg = err.response?.data?.error || "Login failed";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white shadow-lg rounded-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-red-600">Sign in</h2>
        
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4"
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full border border-gray-300 px-3 py-2 rounded-lg mb-4"
        />
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-red-600 text-white py-2 rounded-lg transition ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        
        <p className="mt-6 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/register" className="text-red-600 font-medium">
            Register
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Login;
