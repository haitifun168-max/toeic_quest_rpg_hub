const app = require('./app');
const http = require('http');
const { Server } = require('socket.io');
const { setupPvpWebsocket } = require('./websocket/pvpHandler');

const PORT = process.env.PORT || 3000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupPvpWebsocket(io);

server.listen(PORT, () => {
  console.log(`Authentication & RPG Gateway service with WebSockets running on port ${PORT}`);
});
