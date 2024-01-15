import { useEffect, useState } from "react";
import {  useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";

const URL = "http://localhost:7500";

export const Room = () => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [connected,setConnected]=useState(false)
  const [lobby,setLobby]=useState(true)
  const name = searchParams.get("name");
  useEffect(() => {
    const socket = io(URL);
    socket.on("send-offer",({roomId})=>{
     alert("Send Offer Please...")
     setLobby(false)
     socket.emit("offer",{
        sdp:"",
        roomId
     })
    })
    socket.on("offer",({roomId,offer})=>{
    alert("Send Answer Please...")
     setLobby(false)
    socket.emit("answer",{
        roomId,
        sdp:""
     })
    })
    socket.on("answer",({roomId,answer})=>{
        alert("Connection Established...")
        setLobby(false)
        console.log("RoomId",roomId)
        console.log("answer",answer)
    })
    socket.on("lobby",()=>{
      setLobby(true)
    })
    setSocket(socket);
  }, [name]);

  if(lobby){
    return <div>
    Waiting for someone to connect...
    </div>
  }
  
  return<div>Hii {name}!!!</div>
  
};
