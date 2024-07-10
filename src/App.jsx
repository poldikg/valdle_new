import { useState, useEffect } from 'react'
import './App.css'
import Map from './components/Map'
import Agent from './components/Agent'
import Navigation from './components/Navigation'
import Skin from './components/Skin'
import Ability from './components/Ability'
import { Routes, Route, useLocation, Link } from 'react-router-dom'

function App() {

  const removeTextDecoration = { textDecoration: "none" };

  const currentLocation = useLocation();
  const showNavigation = currentLocation.pathname === "/";
  const [allUserData, setAllUserData] = useState({
    mapGuess: "",
    skinGuess: "",
    voicelineGuess: "",
    agentGuess: "",
    abilityGuess: ""
  });
  const [allAgentsAbilities, setAllAgentsAbilities] = useState(null);
  const agentIcons = allAgentsAbilities === null ? "" : allAgentsAbilities[0]["agentRole"]["displayIcon"];
  const [navigationData, setNavigationData] = useState([{ img: "location-pin-removebg.png", name: "Map", description: "Guess the map" }, { img: "displayicon.png", name: "Agent", description: "Guess the agent" }, { img: "killstreamicon.png", name: "Skin", description: "Guess the skin" },
  { img: "brim-ult.png", name: "Ability", description: "Guess the ability" }, { img: "double-quote.png", name: "Quote", description: "Guess the quote" }])
  const [allAgentsData, setAllAgentsData] = useState([]);

  useEffect(() => {
    fetch("https://valorant-api.com/v1/agents")
      .then(res => res.json())
      .then(data => {
        setAllAgentsData(data.data)
        const agentAbilities = data.data.map(agent => { return { displayName: agent.displayName, agentAbilities: agent.abilities, agentRole: agent.role } });
        setAllAgentsAbilities(agentAbilities);
        // setNavigationData(prevState => {return [...prevState, ] })
        // data.data.map(agent => setAllAgentsAbilities(prevState => {return [...prevState, agent.abilties]}));
      })

  }
    , [])

  // TMR TO DO: New useEffect to be ran after agentsData changes


  // const testArr = [{name: "josh"}, {name: "jake"}, {name: "jake"}];

  // let newArr = [];


  // for(let i in testArr){

  // }

  // for(let i = 0; i < testArr.length; i++){

  // }



  return (

    <div>
      <Link style={removeTextDecoration} to="/"> <h1 className="mainH1">VALDLE</h1></Link>

      <Routes>

        <Route path="/Map" element={<Map />} />
        <Route path='/Agent' element={<Agent />} />
        <Route path="/Skin" element={<Skin />} />
        <Route path='/Ability' element={<Ability />} />
      </Routes>

      {showNavigation && <Navigation navigationData={navigationData} />}
    </div>


  )
}

export default App
