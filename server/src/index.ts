import express from "express";
import { Socket, Server } from "socket.io";
import http from "http";
import { UserManager } from "./managers/UserManager";

const app = express();
const server = http.createServer(http);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const port=7500

const userManager= new UserManager()

io.on("connection", (socket:Socket) => {
  console.log("New User Connected...");
  // add the user to a queue
  userManager.addUser("RandomName",socket)
  socket.on("disconnect",()=>{
    console.log("socket disconnected...")
    userManager.removeUser(socket.id)
  })
});

server.listen(port, () => console.log(`Server started at port ${port}`));
