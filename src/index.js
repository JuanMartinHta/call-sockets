const express = require("express");
const app = express();

const port = 4000;

const http = require("http");
const server = http.createServer(app);

const io = require("socket.io")(server, { origins: "*:*" });
app.use(express.static(__dirname + "/public"));

io.sockets.on("error", (e) => console.log(e));
server.listen(port, () => console.log(`Server is running on port ${port}`));

io.sockets.on("connection", (socket) => {
  socket.on('join', data => {
    console.log('Create room: ' + data.id);
    socket.join(data.id); // We are using room of socket io
  });

  socket.on('call-request', data => {
    // El que llama se une al room de la llamada.
    socket.join(data.callId);
    // Se manda el emit al usuario para que se una al room de la llamada. 
    io.sockets.in(data.receiver).emit("call-request", data);
  });

  socket.on('join-call', data => {
    // El usuario se une al room de la llamada.
    socket.join(data.callId)
    // Se manda emit para notificar que se unio el usuario y comenzar la llamada.
    socket.to(data.callId).emit('joined')
  })

  // mensajes directo al room
  socket.on("offer", data => {
    socket.to(data.callId).emit("offer", data);
  });
  socket.on("answer", data => {
    socket.to(data.callId).emit("answer", data);
  });
  socket.on("candidate", data => {
    socket.to(data.callId).emit("candidate", data);
  });

  socket.on("hangup", data => {
    io.sockets.in(data.chatId).emit("hangup");
  });
});