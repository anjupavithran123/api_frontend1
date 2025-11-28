import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function ResetPassword() {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPass1, setShowPass1] = useState(false);
  const [showPass2, setShowPass2] = useState(false);

  async function handlePasswordUpdate(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Password updated successfully!");
    navigate("/login");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-800 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 max-w-md w-full bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Reset Password
        </h1>

        <form onSubmit={handlePasswordUpdate} className="space-y-5">

          {/* New Password */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPass1 ? "text" : "password"}
                placeholder="••••••••"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="
                  w-full px-4 py-3 pr-12 border border-gray-700 rounded-lg
                  bg-gray-800 text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all
                "
              />

              {/* eye toggle */}
              <button
                type="button"
                onClick={() => setShowPass1(!showPass1)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
              >
                {showPass1 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-300 font-medium mb-1">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={showPass2 ? "text" : "password"}
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="
                  w-full px-4 py-3 pr-12 border border-gray-700 rounded-lg
                  bg-gray-800 text-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  transition-all
                "
              />

              {/* eye toggle */}
              <button
                type="button"
                onClick={() => setShowPass2(!showPass2)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-200"
              >
                {showPass2 ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full bg-blue-600 text-white py-3 rounded-lg
              font-semibold hover:bg-blue-700 disabled:opacity-60
              transition-all shadow-md
            "
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <p className="text-center text-gray-400 mt-5">
          Back to{" "}
          <a href="/login" className="text-blue-500 hover:underline">
            Login
          </a>
        </p>
      </div>

      {/* Animation */}
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
