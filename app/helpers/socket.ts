import { Server } from 'socket.io'

var ios:Server ;
var users = {} ;

export function setWebSocketServer(wss: any) {
  ios = wss;
  ios.on("connect", (socket) => {
    console.log(`WS CONNECTED TO ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`WS DISCONNECTED FROM ${socket.id}`);
    });

    socket.on("auth", (email) => {
      if (email != undefined){
        users[email] = socket;
        console.log(`WS CACHED USER ${email} WITH SOCKET ${socket.id}`);
      }
    });
  });
}

export { ios, users }