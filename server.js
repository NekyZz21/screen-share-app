const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { v4: uuidv4 } = require("uuid");

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const path = require("path");
const express = require("express");

app.use(express.static("public"));

app.get("/room/:roomId", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "room.html"));
});


io.on("connection", (socket) => {

  socket.on("join-room", (roomId) => {
    socket.join(roomId);

    socket.to(roomId).emit("user-connected");

    socket.on("offer", (offer) => {
      socket.to(roomId).emit("offer", offer);
    });

    socket.on("answer", (answer) => {
      socket.to(roomId).emit("answer", answer);
    });

    socket.on("candidate", (candidate) => {
      socket.to(roomId).emit("candidate", candidate);
    });
  });

});

server.listen(process.env.PORT || 3000);