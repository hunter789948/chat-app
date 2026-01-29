import { useState } from "react";

export default function Navbar({ goHome, goLogin, goRegister, showAuthButtons = true }) {
  const [open, setOpen] = useState(false);

  return (
    <nav className="glass-card px-6 py-5">
      {/* Top bar */}
      <div className="flex justify-between items-center">
        
        {/* Logo */}
        <h1
          onClick={() => {
            goHome();
            setOpen(false);
          }}
          className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
        >
          ChatSphere
        </h1>

        {/* Desktop Buttons */}
        {showAuthButtons && (
          <div className="hidden md:flex gap-4">
            <button
              onClick={goLogin}
              className="px-6 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
            >
              Login
            </button>

            <button
              onClick={goRegister}
              className="px-6 py-2 btn-premium"
            >
              Sign Up
            </button>
          </div>
        )}

        {/* Hamburger (Mobile) */}
        {showAuthButtons && (
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl"
          >
            {open ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* Mobile Menu */}
      {showAuthButtons && open && (
        <div className="mt-6 flex flex-col gap-4 md:hidden animate-fadeIn">
          <button
            onClick={() => {
              goLogin();
              setOpen(false);
            }}
            className="w-full px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition"
          >
            Login
          </button>

          <button
            onClick={() => {
              goRegister();
              setOpen(false);
            }}
            className="w-full px-6 py-3 btn-premium"
          >
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
}
