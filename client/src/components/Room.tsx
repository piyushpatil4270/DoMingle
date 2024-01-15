import { useEffect, useRef, useState } from "react";
import {  useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";

const URL = "http://localhost:7500";

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack
}:{
  name:string,
  localAudioTrack:MediaStreamTrack,
  localVideoTrack:MediaStreamTrack
}) => {
  const remoteVideoRef=useRef<HTMLVideoElement>()
  const [socket, setSocket] = useState<null | Socket>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [connected,setConnected]=useState(false)
  const [lobby,setLobby]=useState(true)
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(null);
  const [remoteVideoTrack, setRemoteVideoTrack] = useState<MediaStreamTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] = useState<MediaStreamTrack | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] = useState<MediaStream | null>(null);
  useEffect(() => {
    const socket = io(URL);
    socket.on("send-offer",async({roomId})=>{
     //alert("Send Offer Please...")
     console.log("sending offer...")
     setLobby(false)
     //sets new webrtc connection between local computer and the remote computer
     const pc= new RTCPeerConnection();
     setSendingPc(pc)
     // adds audio and video track to the newly established connection
     pc.addTrack(localAudioTrack)
     pc.addTrack(localVideoTrack)
     pc.onicecandidate=async()=>{
      const sdp=await pc.createOffer()
        socket.emit("offer",{
        sdp,
        roomId
     })
     }
     
    })
    socket.on("offer",async({roomId,offer})=>{
    //alert("Send Answer Please...")
     setLobby(false)
     // establishes new webrtc connection on the remote computer
     const pc= new RTCPeerConnection()
     pc.setRemoteDescription({sdp:offer,type:"offer"})
     const sdp=await pc.createAnswer()
     const stream= new MediaStream()
     if(remoteVideoRef.current){
      remoteVideoRef.current.srcObject=stream
     }
     
     setRemoteMediaStream(stream)
     setReceivingPc(pc)
     pc.ontrack=(({track,type})=>{
      if(type==="audio"){
        setRemoteAudioTrack(track)
      }
      else{
        setRemoteVideoTrack(track)
      }
     })
    socket.emit("answer",{
        roomId,
        sdp:""
     })
    })
    socket.on("answer",({roomId,answer})=>{
       // alert("Connection Established...")
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
