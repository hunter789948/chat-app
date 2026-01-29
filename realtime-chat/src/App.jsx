import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";
import RoomSelector from "./pages/RoomSelector";

function App() {
  const [user, setUser] = useState(null);
  const [room, setRoom] = useState(null); // { id, create }
  const [error, setError] = useState(""); // 👈 NEW (for UI error)
  const [page, setPage] = useState("home");

  // If user logged in but no room yet → show room selector
  if (user && !room) {
    return (
      <RoomSelector
        username={user}
        error={error}
        onJoin={(roomId, create) => {
          setError(""); // clear old error
          setRoom({ id: roomId, create });
        }}
      />
    );
  }

  // If user logged in and room selected → show chat
  if (user && room) {
    return (
      <Chat
        username={user}
        room={room}
        onLeaveRoom={() => setRoom(null)}
        onRoomError={(msg) => {
          setRoom(null);   // go back to room selector
          setError(msg);   // show error in UI
        }}
      />
    );
  }

  // Auth flow
  if (page === "login")
    return (
      <Login
        onLogin={setUser}
        goRegister={() => setPage("register")}
        goHome={() => setPage("home")}
      />
    );

  if (page === "register")
    return (
      <Register
        goLogin={() => setPage("login")}
        goHome={() => setPage("home")}
      />
    );

  return (
    <Home
      goHome={() => setPage("home")}
      goLogin={() => setPage("login")}
      goRegister={() => setPage("register")}
    />
  );
}

export default App;
