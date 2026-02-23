const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // pour générer des IDs uniques
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000; // port dynamique pour Render

// Servir fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Page d'accueil simple : créer une room
app.get('/', (req, res) => {
  const roomId = uuidv4();
  res.redirect(`/room/${roomId}?host=true`);
});

// Route pour accéder à une room
app.get('/room/:id', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'room.html'));
});

// Socket.io : gestion des rooms
io.on('connection', (socket) => {
  console.log("Nouvelle connexion:", socket.id);

  // Rejoindre une room
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    console.log(`${socket.id} a rejoint la room ${roomId}`);
  });

  // Offre
  socket.on("offer", ({roomId, offer}) => {
    socket.to(roomId).emit("offer", offer);
  });

  // Réponse
  socket.on("answer", ({roomId, answer}) => {
    socket.to(roomId).emit("answer", answer);
  });

  // ICE candidates
  socket.on("ice-candidate", ({roomId, candidate}) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on('disconnect', () => {
    console.log('Déconnexion:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));