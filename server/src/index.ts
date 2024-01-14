import express from "express";
import { Socket, Server } from "socket.io";
import http from "http";

const app = express();
const server = http.createServer(http);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
const port = 7500;

io.on("connection", () => {
  console.log("New User Connected...");
});

app.listen(port, () => console.log(`Server started at port ${port}`));
