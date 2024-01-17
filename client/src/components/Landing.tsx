import { useEffect, useRef, useState } from "react"
import { Room } from "./Room"
export const Landing=()=>{
   const videoRef=useRef<HTMLVideoElement>(null)
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
        <div className="flex flex-col gap-5 justify-center items-center">
        <video autoPlay style={{width:"250px",height:"250px"}} ref={videoRef}></video> 
        <input value={name} onChange={(e)=>{setName(e.target.value)}} className="outline-none bg-slate-300 mt-8"/>
        <button onClick={()=>setJoined(true)} >Join</button>
    </div>
      )
   }

   return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}