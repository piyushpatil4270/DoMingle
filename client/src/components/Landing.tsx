import { useEffect, useRef, useState } from "react"
import { Room } from "./Room"
import {SendRounded} from "@mui/icons-material"
export const Landing=()=>{
   const videoRef=useRef<HTMLVideoElement|null>(null)
   const [name,setName]=useState("")
   const [joined,setJoined]=useState(false)
   const [localAudioTrack,setLocalAudioTrack]=useState<MediaStreamTrack | null>(null);
   const [localVideoTrack,setLocalVideoTrack]=useState<MediaStreamTrack | null>(null);

   const getCam=async()=>{
      const stream = await window.navigator.mediaDevices.getUserMedia({
         video:true,
         audio:true
      })
      const audioTrack= stream.getAudioTracks()[0]
      const videoTrack= stream.getVideoTracks()[0]
      setLocalAudioTrack(audioTrack)
      setLocalVideoTrack(videoTrack)
      if(!videoRef.current){
         return ;
      }
      videoRef.current.srcObject= new MediaStream([videoTrack])
      videoRef.current.play()
   }

   useEffect(()=>{
      if(videoRef && videoRef.current){
         getCam()
      }
   },[videoRef])

   if(!joined){
      return(
        <div className="flex flex-col  justify-center items-center w-full h-dvh gradient-bg-welcome gap-5 ">
        {/*<video autoPlay className="w-[25%] py-[25px]" ref={videoRef}></video>*/}
        <span className="text-[35px] text-transparent bg-clip-text bg-gradient-to-r from-slate-200 to-blue-200 ">Do-Mingle...</span>
        <span className="my-[15px] text-[25px] text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600">Connect , Chat and Discover</span>
        <div  className="outline-none bg-transparent border-[1px] border-slate-50 rounded-full text-white w-[25%] flex justify-between">
        <input value={name} onChange={(e)=>{setName(e.target.value)}} placeholder="Enter Your Name" className="outline-none bg-transparent mx-2"/>
        <SendRounded style={{marginLeft:"2px",marginRight:"2px",background:"transparent"}} onClick={()=>{
         if(!name) return;
         setJoined(true)
         }} />
        </div>
        
    </div>
      )
   }

   return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}