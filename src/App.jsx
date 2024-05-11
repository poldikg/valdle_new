import { useState } from 'react'
import './App.css'
import Map from './components/Map'
import Navigation from './components/Navigation'
import { Routes, Route, useLocation, Link } from 'react-router-dom'

function App() {

  const removeTextDecoration = {textDecoration: "none"};

  const currentLocation = useLocation()
  const showNavigation = currentLocation.pathname === "/"
  const [allUserData, setAllUserData] = useState({
    mapGuess: "",
    skinGuess: "",
    voicelineGuess: "",
    agentGuess: "",
    abilityGuess: ""
  })

  const navigationData = [{img: "boom-bot-white.png", name: "Map" ,description: "Guess the map"},{img: "", name: "Agent" ,description: "Guess the agent"},{img: "", name: "Skin" ,description: "Guess the skin"},
  {img: "", name: "Ability" ,description: "Guess the ability"},{img: "", name: "Quote" ,description: "Guess the quote"}
  ]

  return (
   
      <div>
       <Link style={removeTextDecoration}  to="/"> <h1  className="mainH1">VALDLE</h1></Link>

       <Routes>
        
        <Route path="/Map" element={<Map/>}/>
       </Routes>

       {showNavigation && <Navigation navigationData={navigationData}/>}
      </div>
     
 
  )
}

export default App
