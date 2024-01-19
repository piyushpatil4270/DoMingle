import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import Webcam from "react-webcam";
const URL = "http://localhost:7500";

export const Room = ({
  name,
  localAudioTrack,
  localVideoTrack,
}: {
  name: string;
  localAudioTrack: MediaStreamTrack | null;
  localVideoTrack: MediaStreamTrack | null;
  remoteVideoTrack: MediaStreamTrack | null;
  remoteAudioTrack: MediaStreamTrack | null;
}) => {
  
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [socket, setSocket] = useState<null | Socket>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [roomid,setroomId]=useState<string|null>(null)
  const [connected, setConnected] = useState(false);
  const [lobby, setLobby] = useState(true);
  const [sendingPc, setSendingPc] = useState<null | RTCPeerConnection>(null);
  const [receivingPc, setReceivingPc] = useState<null | RTCPeerConnection>(
    null
  );
  const [remoteVideoTrack, setRemoteVideoTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteAudioTrack, setRemoteAudioTrack] =
    useState<MediaStreamTrack | null>(null);
  const [remoteMediaStream, setRemoteMediaStream] =
    useState<MediaStream | null>(null);
  const videoConstraints = {
    width: 360,
    height: 360,
    facingMode: "user",
  };

  useEffect(() => {
    const socket=io(URL)
    socket.on("send-offer", async ({ roomId }) => {
      setroomId(roomId)
      //alert("Send Offer Please...")
      console.log("sending offer...");
      setLobby(false);
      //sets new webrtc connection between local computer and the remote computer
      const pc = new RTCPeerConnection();
      setSendingPc(pc);
      // adds audio and video track to the newly established connection
      // pc.addTrack(localAudioTrack)
      if (localVideoTrack) {
        pc.addTrack(localVideoTrack);
      }
      if (localAudioTrack) {
        pc.addTrack(localAudioTrack);
      }
      pc.onicecandidate = async (e) => {
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "sender",
            roomId,
          });
        }
      };
      pc.onnegotiationneeded = async () => {
        const sdp = await pc.createOffer();
        //@ts-ignore
        pc.setLocalDescription(sdp);
        socket.emit("offer", {
          sdp,
          roomId,
        });
      };
    });
    socket.on("offer", async ({ roomId, sdp: remoteSdp }) => {
      //alert("Send Answer Please...")
      setLobby(false);
      console.log("recieving offer...");
      // establishes new webrtc connection on the remote computer
      const pc = new RTCPeerConnection();
      pc.setRemoteDescription(remoteSdp);
      const sdp = await pc.createAnswer();
      //@ts-ignore
      pc.setLocalDescription(sdp);
      const stream = new MediaStream();
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      setRemoteMediaStream(stream);
      setReceivingPc(pc);
      //window.pcr = pc
      pc.ontrack = () => {
        /* if(type==="audio"){
        //@ts-ignore
        remoteVideoRef.current?.srcObject.addTrack(track)
      }
      else{
        //@ts-ignore
        remoteVideoRef.current?.srcObject.addTrack(track)
      }
      //@ts-ignore
     remoteVideoRef.current.play()*/
      };
      pc.onicecandidate = async (e) => {
        if (!e.candidate) {
          return;
        }
        if (e.candidate) {
          socket.emit("add-ice-candidate", {
            candidate: e.candidate,
            type: "reciever",
            roomId,
          });
        }
      };

      socket.emit("answer", {
        roomId,
        sdp: sdp,
      });
      // settimeout
      setTimeout(() => {
        const track1 = pc.getTransceivers()[0].receiver.track;
        const track2 = pc.getTransceivers()[0].receiver.track;
        if (track1.kind === "video") {
          setRemoteAudioTrack(track2);
          setRemoteVideoTrack(track1);
        } else {
          setRemoteAudioTrack(track1);
          setRemoteVideoTrack(track2);
        }
        //@ts-ignore
        remoteVideoRef.current?.srcObject.addTrack(track1);
        //@ts-ignore
        remoteVideoRef.current?.srcObject.addTrack(track2);
        //@ts-ignore
        remoteVideoRef.current?.play();
        //@ts-ignore
      }, 5000);
    });
    socket.on("answer", ({ roomId, sdp: remoteSdp }) => {
      // alert("Connection Established...")
      console.log("got answer...");
      setLobby(false);
      // console.log("RoomId",roomId)
      // console.log("answer",answer)
      //@ts-ignore
      setSendingPc((pc) => {
        pc?.setRemoteDescription(remoteSdp);
        return pc;
      });
    });
    socket.on("lobby", () => {
      setLobby(true);
    });
    socket.on("add-ice-candidate", ({ candidate, type }) => {
      if (type == "sender") {
        //@ts-ignore
        setReceivingPc((pc) => {
          pc?.addIceCandidate(candidate);
          return pc;
        });
      } else {
        //@ts-ignore
        setSendingPc((pc) => {
          pc?.addIceCandidate(candidate);
          return pc;
        });
      }
    });


    setSocket(socket);
  }, [name]);
  const disconnect=()=>{
    const socket=io(URL)
    setLobby(true)
    socket.emit("disconnectRoom",{roomid})
  }
  useEffect(() => {
    if (localVideoRef.current) {
      if (localVideoTrack) {
        localVideoRef.current.srcObject = new MediaStream([localVideoTrack]);
        localVideoRef?.current?.play();
      }
    }
  }, [localVideoRef]);

  if(lobby){
    return <div className="w-full gradient-bg-welcome h-dvh text-white flex flex-col justify-center items-center">
  <span className="text-[24px] text-white">Waiting For Someone To Connect...</span>
    </div>
  }

  return (
    <div className="w-full h-dvh gradient-bg-welcome flex">
      <div className="flex-1 flex flex-col gap-5 h-full justify-center items-start"> 
        <Webcam
          audio={false}
          width={250}
          height={100}
          ref={localVideoRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="ml-5"
          
        />
        <Webcam
          audio={false}
          width={250}
          height={100}
          ref={remoteVideoRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="m-5"
        />
        
       
        </div>
      
      <div className="flex-1 justify-center">
      <button className="text-white m-5 py-1 px-3 bg-red-600 rounded-sm" 
      onClick={disconnect}
      >Hang Up</button>
      </div>

      {lobby ? "Waiting to connect you to someone" : null}
    </div>
  );
};
