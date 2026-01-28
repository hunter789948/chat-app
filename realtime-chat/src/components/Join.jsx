import { useState } from "react";

export default function Join({ onJoin }) {
  const [name, setName] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      
      {/* Animated background */}
      <div className="bg-animated"></div>

      {/* Card */}
      <div className="glass-card p-10 w-[380px] animate-float">
        
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          Join Chat
        </h1>

        <p className="text-center text-gray-400 text-sm mt-2">
          Enter your name to continue
        </p>

        <input
          className="input-modern w-full mt-6"
          placeholder="Your name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={() => name && onJoin(name)}
          className="btn-premium w-full mt-6"
        >
          Enter Chat →
        </button>
      </div>
    </div>
  );
}
