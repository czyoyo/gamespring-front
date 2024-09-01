import { io } from 'socket.io-client';

let socket;

export function connectSocket(token) {
  socket = io('http://localhost:5000', {
    transports: ['websocket'],
    auth: {
      token,
    },
  });
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}

export function getSocket() {
  if(socket) {
    return socket;
  }
}

export default { connectSocket, disconnectSocket, getSocket };
