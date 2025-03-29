require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// Enable CORS
app.use(cors());
app.use(express.json());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins (change this for production security)
    methods: ["GET", "POST"]
  }
});

 // ADDED: Store active speaker sessions
let speakerSessions = {}; 

// WebSocket Connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

   // ADDED: Handle user joining a speaker session
  socket.on("joinSpeaker", (speakerId) => {
    socket.join(speakerId);
    if (!speakerSessions[speakerId]) {
      speakerSessions[speakerId] = [];
    }
    speakerSessions[speakerId].push(socket.id);
    io.to(speakerId).emit("userJoined", { speakerId, userId: socket.id });
  });

   // ADDED: Handle user disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    for (const speakerId in speakerSessions) {
      speakerSessions[speakerId] = speakerSessions[speakerId].filter(
        (id) => id !== socket.id
      );
    }
  });
});

// Basic API Test Route
app.get("/", (req, res) => {
  res.send("Choco Backend is Running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
