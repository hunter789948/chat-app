const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "supersecretkey";

// In-memory users (temporary storage)
const users = [];

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

// ---------- AUTH ROUTES ----------

// Register
app.post("/register", (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const emailExists = users.find((u) => u.email === email);
  if (emailExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  const usernameExists = users.find((u) => u.username === username);
  if (usernameExists) {
    return res.status(400).json({ message: "Username already taken" });
  }

  users.push({ email, username, password });

  res.json({ message: "Registered successfully" });
});

// Login
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    { email: user.email, username: user.username },
    SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    token,
    username: user.username,
  });
});

// ---------- SOCKET WITH VALID ROOMS ----------

let roomUsers = {};         // { roomId: [username, username] }
let rooms = new Set();      // stores valid room IDs

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join or create room
  socket.on("joinRoom", ({ username, roomId, create }) => {
    socket.username = username;

    // If creating room → register it
    if (create) {
      rooms.add(roomId);
    }

    // If room does not exist → reject join
    if (!rooms.has(roomId)) {
      socket.emit("roomError", "Room does not exist");
      return;
    }

    socket.roomId = roomId;
    socket.join(roomId);

    if (!roomUsers[roomId]) roomUsers[roomId] = [];

    if (!roomUsers[roomId].includes(username)) {
      roomUsers[roomId].push(username);
    }

    io.to(roomId).emit("onlineUsers", roomUsers[roomId]);
    io.to(roomId).emit("system", `${username} joined the room`);
  });

  // Leave room
  socket.on("leaveRoom", () => {
    const { username, roomId } = socket;

    if (username && roomId && roomUsers[roomId]) {
      socket.leave(roomId);

      roomUsers[roomId] = roomUsers[roomId].filter(
        (u) => u !== username
      );

      io.to(roomId).emit("onlineUsers", roomUsers[roomId]);
      io.to(roomId).emit("system", `${username} left the room`);
    }

    socket.roomId = null;
  });

  // Messages (text + image)
  socket.on("sendMessage", (data) => {
    const { username, roomId } = socket;
    if (!username || !roomId || !data) return;

    if (data.type === "text") {
      io.to(roomId).emit("receiveMessage", {
        user: username,
        type: "text",
        text: data.text,
      });
    }

    if (data.type === "image") {
      io.to(roomId).emit("receiveMessage", {
        user: username,
        type: "image",
        image: data.image,
      });
    }
  });

  socket.on("disconnect", () => {
    const { username, roomId } = socket;

    if (username && roomId && roomUsers[roomId]) {
      roomUsers[roomId] = roomUsers[roomId].filter(
        (u) => u !== username
      );

      io.to(roomId).emit("onlineUsers", roomUsers[roomId]);
      io.to(roomId).emit("system", `${username} left the room`);
    }

    console.log("User disconnected:", socket.id);
  });
});

// ---------- SERVER ----------

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
