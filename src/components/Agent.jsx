import React from "react";
import "./Agent.css"
import AgentData from "./AgentData";
import { useState, useEffect } from "react";

const Agent = () => {

    const [agentData, setAgentData] = useState([]);
    const [agentIndex, setAgentIndex] = useState();
    const [userGuessAgent, setUserGuessAgent] = useState("");
    const [allUserGuessesAgent, setAllUserGuessesAgent] = useState([]);
    const [nrUserGuesses, setNrUserGuesses] = useState(0);
    const [userGuessedAgent, setUserGuessedAgent] = useState(false);
    const [eachAgentInfo, setEachAgentInfo] = useState([]);
    console.log(agentData)



    useEffect(() => {
      setAgentData(AgentData)
        const getAgentIndex = localStorage.getItem("AgentIndex") ? localStorage.getItem("AgentIndex") : null
        const getUserGuesses = localStorage.getItem("allUserAgentGuesses") ? JSON.parse(localStorage.getItem("allUserAgentGuesses")) : []
        const randomAgentIndex = Math.floor(Math.random() * (AgentData.length + 1))
        
    
        
        if(getAgentIndex){
            setAllUserGuessesAgent(getUserGuesses)
            setAgentIndex(JSON.parse(getAgentIndex))
            setNrUserGuesses(getUserGuesses === null ? nrUserGuesses : getUserGuesses.length)
        } 
        else{
            localStorage.setItem("AgentIndex", randomAgentIndex)
            setAgentIndex(randomAgentIndex);
            const agentTaskCreated = new Date();
            localStorage.setItem("AgentTaskCreated", agentTaskCreated)
        }



        console.log("Mounted agent")
    },[])

    const changeUserGuessAgent = (event) => {
        setUserGuessAgent(event.target.value)
    }

    const handleFormSubmitAgent = (event) => {
        console.log(event);
        event.preventDefault();
        event.target[0].value = "";
       
        const userGuessAgentTrue = userGuessAgent.toLowerCase() === agentData[agentIndex]["agentName"].toLowerCase()
        const agentNames = agentData.map(agent => agent.agentName)

    
        if (!agentNames.includes(userGuessAgent.charAt(0).toUpperCase() + userGuessAgent.slice(1))) {
            setUserGuessAgent("")
            return false;
        }

        // for(let guess in allUserGuessesAgent){
        // if (allUserGuessesAgent[guess].toLowerCase().includes(userGuessAgent.toLowerCase())) {
        //     setUserGuessAgent("")
        //     return false;
        // }
        // }

        if(userGuessAgentTrue){
            setUserGuessedAgent(true);
            alert("Congratulations you guessed it!");
            localStorage.setItem("userGuessedAgentCorrectly", userGuessAgentTrue)
        }

        if(userGuessAgent === undefined){
            return false;
        }

        if (userGuessAgent) {
            console.log("I am here")
            for (let i = 0; i < agentData.length; i++) {
                if (agentData[i].agentName.toLowerCase() === userGuessAgent.toLowerCase()) {

                    setAllUserGuessesAgent(prevState => {
                        return [...prevState,
                        {
                            agentIcon: agentData[i].agentIcon,
                            agentRole: agentData[i].agentRole,
                            agentSpecies: agentData[i].agentSpecies,
                            agentCountry: agentData[i].agentCountry,
                            agentReleaseDate: agentData[i].agentReleaseDate
                        }]
                    })
                    localStorage.setItem("allUserAgentGuesses", JSON.stringify([...allUserGuessesAgent,
                    {
                        agentIcon: agentData[i].agentIcon,
                        agentRole: agentData[i].agentRole,
                        agentSpecies: agentData[i].agentSpecies,
                        agentCountry: agentData[i].agentCountry,
                        agentReleaseDate: agentData[i].agentReleaseDate
                        
                    }]));

                }
            }



        }

        setNrUserGuesses(prevState => prevState + 1);
        setUserGuessAgent("")

    }

    const renderAgentGuess = allUserGuessesAgent.map(agent => <section className="agent-individual">
        <img src={agent.agentIcon} alt="" srcset="" />
        <div> {agent.agentRole} </div>
        <div> {agent.agentSpecies} </div>
        <div> {agent.agentCountry} </div>
        <div> {agent.agentReleaseDate} </div>
    </section>)

    return (
    <div className="agent-page">
        <div className="agent-upper-section">
            <h2 className="header2-agent-page"> GUESS THE AGENT</h2>
            <section className="hint-section">
                <div className="hint">
                    <div className="hint-button">Quote</div>
                    {(3 - nrUserGuesses) > 0 ? <p>Get a clue in {3 - nrUserGuesses} tries.</p> : <p>Click to get a quote clue.</p>}
                </div>
                <div className="hint">
                    <div className="hint-button">Ability </div>
                    {(6 - nrUserGuesses) > 0 ? <p>Get a clue in {6 - nrUserGuesses} tries.</p> : <p>Click to get an ability clue.</p>}
                </div>
            </section>
            <form action="" onSubmit={handleFormSubmitAgent}>
                <div className="form-section-input">
                    <input className="agent-input" type="text" placeholder="Type your guess" onChange={changeUserGuessAgent} />
                    <button className="agent-submit-button"> {">"}</button>
                </div>
            </form>
        </div>
        <section className="agent-individual-section">
            {allUserGuessesAgent.length > 0 && renderAgentGuess}
        </section>
    </div>)
}

export default Agent;