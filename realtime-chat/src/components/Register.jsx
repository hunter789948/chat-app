import { useState } from "react";
import Navbar from "./Navbar";

export default function Register({ goLogin, goHome }) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error" | "success", text: "" }

  const handleRegister = async () => {
    if (!email || !username || !password) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message });
        return;
      }

      setMessage({
        type: "success",
        text: "Account created successfully! Redirecting to login...",
      });

      // Small delay so user sees success
      setTimeout(() => {
        goLogin();
      }, 1200);
    } catch (err) {
      setMessage({ type: "error", text: "Server error. Is backend running?" });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-animated"></div>

      {/* Navbar */}
      <Navbar
        goHome={goHome}
        goLogin={goLogin}
        goRegister={() => {}}
      />

      {/* Centered card */}
      <div className="flex justify-center items-center mt-24">
        <div className="glass-card p-10 w-[380px] animate-float">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Create Account
          </h1>

          {/* Message box */}
          {message && (
            <div
              className={`mt-4 px-4 py-3 rounded-xl text-sm ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/20"
                  : "bg-red-500/10 text-red-400 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}

          <input
            className="input-modern w-full mt-6"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input-modern w-full mt-4"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password with show/hide */}
          <div className="relative mt-4">
            <input
              type={showPassword ? "text" : "password"}
              className="input-modern w-full pr-12"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
            >
              {showPassword ? "🙈" : "👁"}
            </button>
          </div>

          <button onClick={handleRegister} className="btn-premium w-full mt-6">
            Sign Up →
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <span
              onClick={goLogin}
              className="text-red-400 cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
