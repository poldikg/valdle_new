import React from "react";
import "./Agent.css"
import AgentData from "./AgentData";
import { useState, useEffect } from "react";

const Agent = () => {

    const [agentData, setAgentData] = useState([]);
    const [agentIndex, setAgentIndex] = useState();
    const [userGuessAgent, setUserGuessAgent] = useState(undefined);
    const [allUserGuessesAgent, setAllUserGuessesAgent] = useState([]);
    const [nrUserGuesses, setNrUserGuesses] = useState(0);
    console.log(userGuessAgent)



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
       
        
        if(userGuessAgent === undefined){
            return false;
        }

        if(userGuessAgent){
            console.log("I am here")
            setAllUserGuessesAgent(prevState => { 
                return [...prevState, userGuessAgent]
            })
            localStorage.setItem("allUserAgentGuesses", JSON.stringify([...allUserGuessesAgent, userGuessAgent]));

        }

        setNrUserGuesses(prevState => prevState + 1);
        setUserGuessAgent("")

    }

    return (<div className="agent-page">
        <div className="agent-upper-section">
            <h2 className="header2-agent-page"> Guess the agent</h2>
            <section className="hint-section">
                <div className="hint">
                    <div className="hint-button">Quote</div>
                    {(3 - nrUserGuesses) > 0 ? <p>Get a clue in {3 - nrUserGuesses} tries.</p> : <p>Click to get a quote clue.</p>}
                </div>
                <div className="hint">
                    <div className="hint-button">Ability </div>
                    {(6 - nrUserGuesses) > 0 ? <p>Get a clue in {6 - nrUserGuesses} tries.</p> : <p>Click to get a ability clue.</p>}
                </div>
            </section>
            <form action="" onSubmit={handleFormSubmitAgent}>
                <div className="form-section-input">
                    <input className="agent-input" type="text" placeholder="Type your guess" onChange={changeUserGuessAgent} />
                    <button className="agent-submit-button"> {">"}</button>
                </div>
            </form>
        </div>
    </div>)
}

export default Agent;