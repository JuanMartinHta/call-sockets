const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.get('/', (req, res) => {
  res.status(200).json({
    status: 'success'
  });
});

const io = require("socket.io")(server, { origins: "*:*" });

io.sockets.on("error", (e) => console.log(e));

io.sockets.on("connection", (socket) => {
  console.log('Connected: ' + socket.id)

  socket.on('join', (data, callback) => {
    console.log('join to room: ' + data.room);
    socket.join(data.room); // We are using room of socket io

    callback({ status: true, message: 'joined' })
  });

  socket.on('sendMessage', data => {
    console.log({ data });
    socket.to(data.room).emit('onReceiveMessage', data);
  });
});

server.listen(4000, () => console.log(`Server is running on port ${4000}`));