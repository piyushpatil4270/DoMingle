import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
export const Landing=()=>{
   const [name,setName]=useState("")
   const [joined,setJoined]=useState(false)
   useEffect(()=>{

   },[])
   return <div className="flex flex-col gap-5 justify-center items-center">
        <input value={name} onChange={(e)=>{setName(e.target.value)}} className="outline-none bg-slate-300 mt-8"/>
       <Link to={`/room/?name=${name}`}> <button >Join</button></Link>
    </div>
}