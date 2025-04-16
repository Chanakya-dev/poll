const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 5000;
const POLL_DURATION = 60 * 1000;
const ROOM_COOLDOWN = 60 * 1000;

let roomTimers = {};
let votes = {};
let lastRoomCreationTime = {};

const timestamp = () => new Date().toLocaleTimeString();

io.on("connection", (socket) => {
  console.log(`[${timestamp()}] ✅ New client connected`);

  socket.on("joinRoom", ({ roomId, userName, sceneId, options }) => {
    if (!roomId || sceneId === undefined) return;
    socket.join(roomId);

    const now = Date.now();
    const lastCreated = lastRoomCreationTime[roomId];
    const isCooldownActive = lastCreated && now - lastCreated < ROOM_COOLDOWN;

    if (!roomTimers[roomId]) {
      if (isCooldownActive) {
        const waitTime = Math.ceil((ROOM_COOLDOWN - (now - lastCreated)) / 1000);
        socket.emit("errorMessage", `Room was recently active. Please wait ${waitTime}s`);
        console.log(`[${timestamp()}] 🚫 Room ${roomId} recently used. Wait ${waitTime}s.`);
        return;
      }

      lastRoomCreationTime[roomId] = now;
      roomTimers[roomId] = {
        startTime: now,
        sceneId,
        timeoutId: setTimeout(() => {
          const voteCount = votes[roomId]?.[sceneId] || [0, 0];
          const [a, b] = voteCount;
          let winnerIndex = null;

          if (a > b) winnerIndex = 0;
          else if (b > a) winnerIndex = 1;

          const winnerName = winnerIndex !== null ? options[winnerIndex] : "It's a Tie";

          io.to(roomId).emit("votingResult", {
            winningOption: winnerIndex,
            winnerName,
            votes: voteCount
          });

          if (votes[roomId]) {
            votes[roomId][sceneId] = [0, 0];
            console.log(`[${timestamp()}] 🔁 Reset votes for room ${roomId}, scene ${sceneId}`);
          }

          delete roomTimers[roomId];
          console.log(`[${timestamp()}] 🧹 Timer cleared for room ${roomId}`);
        }, POLL_DURATION)
      };

      console.log(`[${timestamp()}] ⏱️ Poll started for room ${roomId}`);
    }

    socket.emit("timerStart", {
      startTime: roomTimers[roomId].startTime
    });

    console.log(`[${timestamp()}] 👤 ${userName || "User"} joined room ${roomId}`);
  });

  socket.on("submitVote", ({ roomId, sceneId, optionIndex }) => {
    if (!roomId || sceneId === undefined || optionIndex === undefined) return;

    if (!votes[roomId]) votes[roomId] = {};
    if (!votes[roomId][sceneId]) votes[roomId][sceneId] = [0, 0];

    votes[roomId][sceneId][optionIndex]++;
    console.log(`[${timestamp()}] 🗳️ Vote recorded: Room ${roomId}, Scene ${sceneId}, Option ${optionIndex}`);
  });

  socket.on("disconnect", () => {
    console.log(`[${timestamp()}] ❌ Client disconnected`);
  });
});

server.listen(PORT, () => {
  console.log(`[${timestamp()}] 🚀 Server running at http://localhost:${PORT}`);
});
