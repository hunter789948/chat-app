export default function Navbar({ goHome, goLogin, goRegister, showAuthButtons = true }) {
  return (
    <nav className="flex justify-between items-center px-10 py-6 glass-card">
      
      {/* Logo / Heading → Home Button */}
      <h1
        onClick={goHome}
        className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent"
      >
        ChatSphere
      </h1>

      {/* Buttons */}
      {showAuthButtons && (
        <div className="flex gap-4">
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
    </nav>
  );
}
