const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // pour générer des IDs uniques

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 3000;

// Servir les fichiers statiques
app.use(express.static('public'));

// Page d'accueil qui crée une room
app.get('/', (req, res) => {
  res.send(`
    <h1>Créer une room de partage d'écran</h1>
    <a href="/room/${uuidv4()}?host=true">Créer une room</a>
  `);
});

// Route pour accéder à une room
app.get('/room/:id', (req, res) => {
  res.sendFile(__dirname + '/public/room.html');
});

// SOCKET.IO pour WebRTC
io.on('connection', (socket) => {
  console.log("Nouvelle connexion:", socket.id);

  socket.on("offer", (offer) => {
    socket.broadcast.emit("offer", offer);
  });

  socket.on("answer", (answer) => {
    socket.broadcast.emit("answer", answer);
  });

  socket.on("ice-candidate", (candidate) => {
    socket.broadcast.emit("ice-candidate", candidate);
  });
});

server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));