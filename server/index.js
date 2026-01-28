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

  // Check email
  const emailExists = users.find((u) => u.email === email);
  if (emailExists) {
    return res.status(400).json({ message: "Email already exists" });
  }

  // Check username
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
    username: user.username, // 👈 important for frontend
  });
});

// ---------- SOCKET ----------

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (username) => {
    socket.username = username;
    io.emit("system", `${username} joined the chat`);
  });

  socket.on("sendMessage", (message) => {
    io.emit("receiveMessage", {
      user: socket.username,
      text: message,
    });
  });

  socket.on("disconnect", () => {
    if (socket.username) {
      io.emit("system", `${socket.username} left the chat`);
    }
  });
});

// ---------- SERVER ----------

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
