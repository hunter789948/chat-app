import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function Chat({ username }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.emit("join", username);

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("system", (text) => {
      setMessages((prev) => [...prev, { user: "System", text }]);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("system");
    };
  }, [username]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;
    socket.emit("sendMessage", message);
    setMessage("");
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">

      {/* Animated background */}
      <div className="bg-animated"></div>

      {/* Header */}
      <div className="glass-card px-8 py-6 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Chat Room
          </h1>
          <p className="text-xs text-gray-400">
            Logged in as <span className="text-white">{username}</span>
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        {messages.map((msg, i) => {
          const isMe = msg.user === username;
          const isSystem = msg.user === "System";

          if (isSystem) {
            return (
              <div key={i} className="text-center text-xs text-gray-500">
                {msg.text}
              </div>
            );
          }

          return (
            <div
              key={i}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-md px-5 py-4 rounded-2xl text-sm leading-relaxed shadow-xl transition-all animate-fadeIn ${
                  isMe
                    ? "bg-gradient-to-r from-red-500 to-orange-500 text-black rounded-br-none shadow-red-500/30"
                    : "glass-card text-white rounded-bl-none"
                }`}
              >
                <p className="text-[10px] opacity-60 mb-1">
                  {msg.user}
                </p>
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input Bar */}
      <div className="glass-card p-6 border-t border-white/5 flex gap-4">
        <input
          className="input-modern flex-1"
          placeholder="Write your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="btn-premium px-10"
        >
          Send
        </button>
      </div>
    </div>
  );
}
