import { useState } from "react";

export default function RoomSelector({ username, onJoin, error }) {
  const [roomId, setRoomId] = useState("");

  const createRoom = () => {
    const newRoom = Math.random().toString(36).substring(2, 8);
    onJoin(newRoom, true); // create = true
  };

  const joinRoom = () => {
    if (!roomId.trim()) return;
    onJoin(roomId.trim(), false); // create = false
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="glass-card p-10 w-full max-w-md space-y-6">
        
        <h1 className="text-2xl font-bold text-center">
          Welcome, {username}
        </h1>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {/* Join Room */}
        <div className="space-y-2">
          <input
            placeholder="Enter Room ID"
            className="input-modern w-full"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button onClick={joinRoom} className="btn-premium w-full">
            Join Room
          </button>
        </div>

        <div className="text-center text-gray-400">OR</div>

        {/* Create Room */}
        <button onClick={createRoom} className="btn-premium w-full">
          Create New Room
        </button>
      </div>
    </div>
  );
}
