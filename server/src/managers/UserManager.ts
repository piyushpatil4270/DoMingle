import { Socket } from "socket.io";
import { RoomManager } from "./RoomManager";
export interface User {
  name: string;
  socket: Socket;
}

export class UserManager {
  private users: User[];
  private queue: string[];
  private roomManager: RoomManager;
  constructor() {
    this.users = [];
    this.queue = [];
    this.roomManager = new RoomManager();
  }
  addUser(name: string, socket: Socket) {
    this.users.push({
      name,
      socket,
    });
    // socket id will be pushed to the queue
    //console.log(socket.id)
    //console.log(this.users)
    this.queue.push(socket.id);
    socket.send("lobby");
    this.clearQueue();
    this.initHandlers(socket);
  }
  removeUser(socketId: string) {
    const user = this.users.find((user) => user.socket.id === socketId);
    this.users = this.users.filter((user) => user.socket.id !== socketId);
    this.queue = this.queue.filter((id) => id === socketId);
  }
  clearQueue() {
    console.log("Length of the queue",this.queue.length)
    if (this.queue.length < 2) {
      return;
    }
    // this will find the user with socketid queue length and decrease the length of the queue by one 
    const id1=this.queue.pop()
    const id2=this.queue.pop()
    const user1 = this.users.find(
      (user) => user.socket.id ===id1
    );
    // this will find another user with the socketid with id equal to the length of the queue and decrease the length of the queue by one
    const user2 = this.users.find(
      (user) => user.socket.id === id2
    );
    if (!user1 || !user2) return;
    // this will create the room with the 2 Users
    this.roomManager.createRoom(user1, user2);
  }
  // sends offer and takes response from both the users
  initHandlers(socket: Socket) {
    socket.on("offer", ({ roomId, sdp }: { sdp: string; roomId: string }) => {
      this.roomManager.onOffer(roomId, sdp);
    });
    socket.on("answer", ({ roomId, sdp }: { sdp: string; roomId: string }) => {
      this.roomManager.onAnswer(roomId, sdp);
    });
  }
}
