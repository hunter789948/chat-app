import { useState } from "react";
import Navbar from "./Navbar";

export default function Login({ onLogin, goRegister, goHome }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState(null); // { type: "error" | "success", text: "" }

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage({ type: "error", text: "All fields are required" });
      return;
    }

    try {
      const res = await fetch("https://chat-app-backend-hfnd.onrender.com/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.message });
        return;
      }

      setMessage({ type: "success", text: "Login successful!" });

      setTimeout(() => {
        onLogin(data.username);
      }, 500);
    } catch (error) {
      setMessage({ type: "error", text: "Server error. Is backend running?" });
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-animated"></div>

      {/* Navbar */}
      <Navbar
        goHome={goHome}
        goLogin={() => {}}
        goRegister={goRegister}
      />

      {/* Centered card */}
      <div className="flex justify-center items-center mt-24">
        <div className="glass-card p-10 w-[380px] animate-float">
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Welcome Back
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

          <button onClick={handleLogin} className="btn-premium w-full mt-6">
            Login →
          </button>

          <p className="text-center text-sm text-gray-400 mt-6">
            No account?{" "}
            <span
              onClick={goRegister}
              className="text-red-400 cursor-pointer hover:underline"
            >
              Create one
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
