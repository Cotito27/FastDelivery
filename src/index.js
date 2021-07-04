require('dotenv').config();

const app = require('./app').app;
const sessionMiddleware = require('./app').sessionMiddleware;
const http = require('http');
// const socketio = require('socket.io');

const server = http.createServer(app);
// const io = socketio(servser);

// io.use(function(socket, next) {
//   sessionMiddleware(socket.request, socket.request.res, next);
// });

// require('./sockets')[0](io);

// database
require('./database');

// listening the server
async function main() {
  await server.listen(app.get('port'));
  console.log(`server on port ${app.get('port')}`);
}

main();