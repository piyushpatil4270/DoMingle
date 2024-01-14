import { useEffect, useState } from "react";
import {  useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";

const URL = "http://localhost:3000";

export const Room = () => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [connected,setConnected]=useState(false)
  const name = searchParams.get("name");
  useEffect(() => {
    const socket = io(URL, {
      autoConnect: false,
    });
    socket.on("send-offer",({roomId})=>{
     alert("Send Offer Please...")
     socket.emit("offer",{
        sdp:"",
        roomId
     })
    })
    socket.on("offer",({roomId,offer})=>{
     alert("Send Answer Please...")
     socket.emit("answer",{
        roomId,
        sdp:""
     })
    })
    socket.on("answer",({roomId,answer})=>{
        alert("Connection Established...")
        console.log("RoomId",roomId)
        console.log("answer",answer)
    })
    setSocket(socket);
  }, [name]);
  return <div>Hii {name}!!!</div>;
};
