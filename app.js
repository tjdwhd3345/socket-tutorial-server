const express = require('express');
const app = express();
const { WebSocketServer } = require('ws');

const port = 5000;

const httpServer = app.listen(port, () => {
  console.log(`express server listenling... ${port}`);
});

const wsServer = new WebSocketServer({ server: httpServer });

wsServer.broadcast = (message) => {
  wsServer.clients.forEach((client) => client.send(message));
};

wsServer.on('connection', (socket) => {
  console.log(`someone connected! ${wsServer.clients.size}`, socket);
  // wsServer.clients.forEach((client) =>
  //   client.send(`새로운 유저 접속. 현재 ${wsServer.clients.size}명`)
  // );
  wsServer.broadcast(`새로운 유저 접속. 현재 ${wsServer.clients.size}명`);

  socket.onopen = (event) => {
    console.log('onopen', { event });
  };
  socket.onmessage = (event) => {
    const { data } = event;
    console.log('onmessage', { data, type: typeof data, jp: JSON.parse(data) });
    socket.send(`server received: ${JSON.parse(data)}`);
  };
});
