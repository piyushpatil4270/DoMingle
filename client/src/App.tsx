import { Route, Routes } from "react-router-dom"
import { Landing } from "./components/Landing"
import { Room } from "./components/Room"
import {BrowserRouter as Router} from "react-router-dom"
function App() {

return (
    <>
    <Router>
    <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/room/:name" element={<Room/>} />
      </Routes>
      </Router>
    </>
  )
}

export default App
