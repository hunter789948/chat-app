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
      <div className="flex flex-col items-center justify-center text-center px-6 pt-28 sm:pt-32 md:pt-36">

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          A better way to
        </h2>

        <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-3 bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
          <TextType
            words={[
              "chat with friends.",
              "connect instantly.",
              "build communities.",
              "share ideas.",
            ]}
          />
        </h3>

        <p className="text-gray-400 max-w-xl mt-5 sm:mt-6 text-base sm:text-lg">
          A modern real-time chat experience with beautiful UI and secure authentication.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8 sm:mt-10 w-full sm:w-auto">
          <button
            onClick={goRegister}
            className="btn-premium px-8 py-4 w-full sm:w-auto"
          >
            Get Started →
          </button>

          <button
            onClick={goLogin}
            className="px-8 py-4 w-full sm:w-auto rounded-xl border border-white/10 hover:bg-white/5 transition"
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
