import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import EmojiPicker from "emoji-picker-react";

const socket = io("https://chat-app-backend-hfnd.onrender.com");

export default function Chat({ username, room, onLeaveRoom, onRoomError }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [showEmoji, setShowEmoji] = useState(false);
  const [file, setFile] = useState(null);

  const bottomRef = useRef(null);
  const fileInputRef = useRef(null);

  // Join room
  useEffect(() => {
    if (!username || !room) return;

    socket.emit("joinRoom", {
      username,
      roomId: room.id,
      create: room.create,
    });

    socket.on("roomError", (msg) => {
      if (onRoomError) onRoomError(msg);
    });

    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    socket.on("system", (text) => {
      setMessages((prev) => [...prev, { user: "System", text }]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("roomError");
      socket.off("receiveMessage");
      socket.off("system");
      socket.off("onlineUsers");
    };
  }, [username, room]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim() && !file) return;

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        socket.emit("sendMessage", {
          type: "image",
          image: reader.result,
        });
      };
      reader.readAsDataURL(file);
      setFile(null);
    }

    if (message.trim()) {
      socket.emit("sendMessage", {
        type: "text",
        text: message,
      });
    }

    setMessage("");
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom");
    if (onLeaveRoom) onLeaveRoom();
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="bg-animated"></div>

      {/* Header */}
      <div className="glass-card px-6 py-5 flex justify-between items-center border-b border-white/5">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
            Room: {room.id}
          </h1>
          <p className="text-xs text-gray-400">
            Logged in as <span className="text-white">{username}</span>
          </p>
        </div>

        <button
          onClick={handleLeaveRoom}
          className="px-4 py-2 text-sm rounded-lg border border-white/10 hover:bg-white/5 transition"
        >
          Leave Room
        </button>
      </div>

      {/* Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 sm:w-64 bg-black/40 backdrop-blur-xl border-r border-white/5 p-4">
          <h2 className="text-sm text-gray-400 mb-4">
            Online Users ({onlineUsers.length})
          </h2>

          <div className="space-y-3">
            {onlineUsers.map((user, i) => (
              <div key={i} className="flex items-center gap-3 text-sm text-white">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                {user}
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {messages.filter(Boolean).map((msg, i) => {
            const isMe = msg?.user === username;
            const isSystem = msg?.user === "System";

            if (isSystem) {
              return (
                <div key={i} className="text-center text-xs text-gray-500">
                  {typeof msg.text === "string" ? msg.text : ""}
                </div>
              );
            }

            return (
              <div key={i} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-md px-5 py-4 rounded-2xl text-sm shadow-xl ${
                    isMe
                      ? "bg-gradient-to-r from-red-500 to-orange-500 text-black rounded-br-none shadow-red-500/30"
                      : "glass-card text-white rounded-bl-none"
                  }`}
                >
                  <p className="text-[10px] opacity-60 mb-1">{msg?.user}</p>

                  {msg?.type === "image" ? (
                    <img
                      src={msg.image}
                      alt="sent"
                      className="rounded-lg max-h-60 cursor-pointer"
                    />
                  ) : (
                    msg?.text || ""
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input Bar */}
      <div className="glass-card p-6 border-t border-white/5 relative">
        {showEmoji && (
          <div className="absolute bottom-24 left-6 z-50">
            <EmojiPicker
              theme="dark"
              onEmojiClick={(e) => setMessage((prev) => prev + e.emoji)}
            />
          </div>
        )}

        {file && (
          <div className="mb-2 text-xs text-gray-400">
            Selected: {file.name}
          </div>
        )}

        <div className="flex gap-4 items-center">
          <button onClick={() => setShowEmoji(!showEmoji)} className="text-xl">
            😄
          </button>

          <button onClick={() => fileInputRef.current.click()} className="text-xl">
            📎
          </button>

          <input
            ref={fileInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <input
            className="input-modern flex-1"
            placeholder="Write your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />

          <button onClick={sendMessage} className="btn-premium px-10">
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
