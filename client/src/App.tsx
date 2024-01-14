import { Route, Routes } from "react-router-dom"
import { Landing } from "./components/Landing"
import { Room } from "./components/Room"

function App() {

return (
    <>
    <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/room/:name" element={<Room/>} />
      </Routes>
    </>
  )
}

export default App
