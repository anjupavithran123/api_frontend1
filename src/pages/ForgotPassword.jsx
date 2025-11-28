import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleReset(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/reset-password", // change if needed
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-800 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/80 backdrop-blur-lg p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Forgot Password
        </h1>

        {!sent ? (
          <form onSubmit={handleReset} className="space-y-4">
            <p className="text-gray-300 text-center mb-2">
              Enter your email and we’ll send you a reset link.
            </p>

            {/* Email */}
            <div>
              <label className="block text-gray-300 font-medium mb-1">
                Email
              </label>
              <input
                type="email"
                required
                placeholder="example@mail.com"
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

            <button
              type="submit"
              disabled={loading}
              className="
                w-full bg-blue-600 text-white py-3 rounded-lg
                font-semibold hover:bg-blue-700 disabled:opacity-60
                transition-all shadow-md
              "
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        ) : (
          <div className="text-center text-green-400 font-medium">
            ✔ Password reset link sent to your email.
          </div>
        )}

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
