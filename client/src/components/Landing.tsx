import { useEffect, useRef, useState } from "react"
import { Room } from "./Room"
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
        <span className="text-[35px] text-transparent bg-clip-text bg-gradient-to-r from-pink-800 my-5 to-purple-600 ">Do-Mingle</span>
        <div  className="outline-none bg-transparent border-[1px] border-slate-50 rounded-full text-white w-[25%]">
        <input value={name} onChange={(e)=>{setName(e.target.value)}} className="outline-none bg-transparent mx-2"/>
        </div>
        
    </div>
      )
   }

   return <Room name={name} localAudioTrack={localAudioTrack} localVideoTrack={localVideoTrack} />
}