import { useEffect } from "react"
import { useParams } from "react-router-dom"

export const Room=()=>{
    const {name}=useParams()
    useEffect(()=>{
        
    },[name])
    return <div>
        Room {name}
    </div>
}