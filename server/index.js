// server/index.js
const { Server } = require("socket.io");
const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("setUsername", (username) => {
    socket.data.username = username;
  });

  socket.on("sendMessage", (message) => {
    io.emit("newMessage", {
      username: socket.data.username,
      message,
    });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

server.listen(3001, () => {
  console.log("Socket.IO server listening on port 3001");
});
