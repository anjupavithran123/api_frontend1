import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate, Link } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Signup successful! Please login.");
    navigate("/login");
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-800 animate-gradient-x"></div>
        <div className="absolute inset-0 bg-black/60"></div>
      </div>

      {/* Signup Form */}
      <div className="relative z-10 w-full max-w-md bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-white mb-6 tracking-tight">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-5">

          {/* Full Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-300">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="
                w-full p-3 border border-gray-700 rounded-lg
                bg-gray-800 text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium text-gray-300">Email</label>
            <input
              type="email"
              placeholder="example@mail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="
                w-full p-3 border border-gray-700 rounded-lg
                bg-gray-800 text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all
              "
            />
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium text-gray-300">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="
                w-full p-3 border border-gray-700 rounded-lg
                bg-gray-800 text-white
                focus:outline-none focus:ring-2 focus:ring-blue-500
                transition-all
              "
            />
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 bg-blue-600 text-white rounded-lg font-semibold 
              hover:bg-blue-700 disabled:opacity-60 transition-all shadow-md
            "
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-gray-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>

      {/* Tailwind Animated Gradient Keyframes */}
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
