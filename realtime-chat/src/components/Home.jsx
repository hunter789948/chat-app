import Navbar from "./Navbar";
import TextType from "./TextType";

export default function Home({ goHome, goLogin, goRegister }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="bg-animated"></div>

      <Navbar
        goHome={goHome}
        goLogin={goLogin}
        goRegister={goRegister}
      />

      {/* Hero */}
      <div className="flex flex-col items-center justify-center text-center mt-32 px-6">
        <h2 className="text-5xl font-bold text-white">
          A better way to
        </h2>

        <h3 className="text-5xl font-bold mt-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          <TextType
            words={[
              "chat with friends.",
              "connect instantly.",
              "build communities.",
              "share ideas.",
            ]}
          />
        </h3>

        <p className="text-gray-400 max-w-xl mt-6 text-lg">
          A modern real-time chat experience with beautiful UI and secure authentication.
        </p>

        <div className="flex gap-6 mt-10">
          <button onClick={goRegister} className="btn-premium px-10 py-4">
            Get Started →
          </button>
          <button onClick={goLogin} className="px-10 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition">
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
