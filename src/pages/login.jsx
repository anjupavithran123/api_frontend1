import { useState } from "react";
import { supabase } from "../lib/supabase";
import { Link, useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ toggle

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/dashboard");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-800 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white text-center mb-6 tracking-tight">
          Login
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full px-4 py-3 border border-gray-700 rounded-lg
                bg-gray-800 text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all
              "
            />
          </div>

          {/* Password with toggle eye */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="
                  w-full px-4 py-3 pr-12 border border-gray-700 rounded-lg
                  bg-gray-800 text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all
                "
              />

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-blue-400 hover:underline text-sm"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-blue-600 text-white py-3 rounded-lg 
              font-semibold hover:bg-blue-700 disabled:opacity-60 
              transition-all shadow-md
            "
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-5">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      <style>
        {`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% center; }
            50% { background-position: 100% center; }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 10s ease infinite;
          }
        `}
      </style>
    </div>
  );
}
