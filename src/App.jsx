import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import Navigation from './components/Navigation'
import { Routes, Route, useLocation } from 'react-router-dom'

function App() {



  const currentLocation = useLocation()
  const showNavigation = currentLocation.pathname === "/"
  const [allUserData, setAllUserData] = useState({
    mapGuess: "",
    skinGuess: "",
    voicelineGuess: "",
    agentGuess: "",
    abilityGuess: ""
  })

  return (
   
      <div>
       <h1>Valdle</h1>

       <Routes>
        
        <Route path="/Map" element={<Map/>}/>
       </Routes>

       {showNavigation && <Navigation/>}
      </div>
     
 
  )
}

export default App
