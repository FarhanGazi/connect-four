import { Server } from 'socket.io'

var ios:Server ;
var users = {} ;

export function setWebSocketServer(wss: any) {
  ios = wss;
  ios.on("connect", (socket) => {
    console.log(`WS CONNECTED TO ${socket.id}`);

    socket.on("disconnect", () => {
      var id = Object.keys(users).find(key => users[key].id === socket.id);
      delete users[id];
      console.log(`WS DISCONNECTED FROM ${socket.id}`);
    });

    socket.on("auth", (id) => {
      if (id != undefined){
        users[id] = socket;
        console.log(`WS CACHED USER ${id} WITH SOCKET ${socket.id}`);
      }
    });
  });
}

export { ios, users }