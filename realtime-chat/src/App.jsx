import { useState } from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Chat from "./components/Chat";

function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("home");

  if (user) return <Chat username={user} />;

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
