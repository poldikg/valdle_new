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
    const [suggestedAgents, setSuggestedAgents] = useState([]);
    console.log(suggestedAgents)

    const styleWrongGuess = {
        backgroundColor: "#D2404D", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        border: "1px solid #FEFEFE", 
        borderRadius: "4px",
        width: "90px",
        height: "auto",
    };

    const styleRightGuess = {
        backgroundColor: "#16AC25", 
        display: "flex", 
        flexDirection: "column", 
        justifyContent: "center", 
        border: "1px solid #FEFEFE", 
        borderRadius: "4px",
        width: "90px",
        height: "auto",
    };

    const submitAgentSuggestion = (agentName) => {
        setUserGuessAgent(agentName)
    }

    const FilterAgents = (agent) => {
        if(userGuessAgent !== "" && agent.agentName.slice(0, userGuessAgent.length) === userGuessAgent.charAt(0).toUpperCase() + userGuessAgent.slice(1)){
            return agent;
        }
    }

    useEffect(() => {

        const SuggestAgentsArr = agentData.filter(agent => FilterAgents(agent)).map(agent => {
            return {
                agentIcon: agent.agentIcon,
                agentName: agent.agentName
            }
        })
        setSuggestedAgents(SuggestAgentsArr);

    }, [userGuessAgent])

    useEffect(() => {
      setAgentData(AgentData)
        const getAgentIndex = localStorage.getItem("AgentIndex") ? localStorage.getItem("AgentIndex") : null
        const getUserGuesses = localStorage.getItem("allUserAgentGuesses") ? JSON.parse(localStorage.getItem("allUserAgentGuesses")) : []
        const randomAgentIndex = Math.floor(Math.random() * (AgentData.length));
        const getUserCorrectGuessAgent = JSON.parse(localStorage.getItem("userGuessedAgentCorrectly"));

       
        
    
        
        if(getAgentIndex){
            setAllUserGuessesAgent(getUserGuesses)
            setAgentIndex(parseInt(getAgentIndex))
            setNrUserGuesses(getUserGuesses === null ? nrUserGuesses : getUserGuesses.length)

            if(getUserCorrectGuessAgent){
                const inputAgent = document.querySelector(".agent-input");
                const inputButtonAgent = document.querySelector(".agent-submit-button");
                inputAgent.setAttribute("disabled", true);
                inputButtonAgent.setAttribute("disabled", true);
                inputAgent.setAttribute("placeholder", "TRY AGAIN TOMORROW!")
                setUserGuessedAgent(true)
            }
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

        for(let i = 0; i < allUserGuessesAgent.length; i++){
            if(allUserGuessesAgent[i].agentName.includes(userGuessAgent.charAt(0).toUpperCase() + userGuessAgent.slice(1))){
            setUserGuessAgent("");
            return false;
        }
        }
        

        if(userGuessAgentTrue){
            setUserGuessedAgent(true);
            localStorage.setItem("userGuessedAgentCorrectly", userGuessAgentTrue)
            event.target[0].disabled = true;
            event.target[0].textContent = "TRY AGAIN TOMORROW";
            event.target[1].disabled = true;
        }

        if(userGuessAgent === undefined){
            return false;
        }

        if (userGuessAgent) {// The condition could be removed, test tomorrow.
            console.log("I am here")
            for (let i = 0; i < agentData.length; i++) {
                if (agentData[i].agentName.toLowerCase() === userGuessAgent.toLowerCase()) {

                    setAllUserGuessesAgent(prevState => {
                        return [...prevState,
                        {
                            agentName: agentData[i].agentName,
                            agentIcon: agentData[i].agentIcon,
                            agentRole: agentData[i].agentRole,
                            agentSpecies: agentData[i].agentSpecies,
                            agentCountry: agentData[i].agentCountry,
                            agentReleaseDate: agentData[i].agentReleaseDate
                        }]
                    })
                    localStorage.setItem("allUserAgentGuesses", JSON.stringify([...allUserGuessesAgent,
                    {
                        agentName: agentData[i].agentName,
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

    const renderAgentGuess = allUserGuessesAgent.map(agent => {
        return agent.agentName === agentData[agentIndex].agentName ?
            <section className="agent-individual">
                <div style={styleRightGuess}>
                    <img src={agent.agentIcon} alt="" srcset="" />
                </div>
                <div style={styleRightGuess}> {agent.agentRole} </div>
                <div style={styleRightGuess}> {agent.agentSpecies} </div>
                <div style={styleRightGuess}> {agent.agentCountry} </div>
                <div style={styleRightGuess}> {agent.agentReleaseDate} </div>
            </section>
            :
            <section className="agent-individual">
                <div style={styleWrongGuess}>
                    <img src={agent.agentIcon} alt="" srcset="" />
                </div>
                <div style={agent.agentRole === agentData[agentIndex].agentRole ? styleRightGuess : styleWrongGuess}> {agent.agentRole} </div>
                <div style={agent.agentSpecies === agentData[agentIndex].agentSpecies ? styleRightGuess : styleWrongGuess}> {agent.agentSpecies} </div>
                <div style={agent.agentCountry === agentData[agentIndex].agentCountry ? styleRightGuess : styleWrongGuess}> {agent.agentCountry} </div>
                <div style={agent.agentReleaseDate === agentData[agentIndex].agentReleaseDate ? styleRightGuess : styleWrongGuess}> {agent.agentReleaseDate} </div>
            </section>
    })

    const renderAgentSuggestions = suggestedAgents.map(agent => {
        return <button className="suggest-agent-button" onClick={() => submitAgentSuggestion(agent.agentName)}>
           <img src={agent.agentIcon} alt="" srcset="" />
            <div>{agent.agentName}</div>
        </button>
    })

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
                    <input className="agent-input" type="text" placeholder={userGuessedAgent ?  "TRY AGAIN TOMORROW" : "Type your guess"} onChange={changeUserGuessAgent} />
                    <button className="agent-submit-button"> {">"}</button>
                </div>
                    { userGuessAgent.length > 0 && <section className="suggest-agent-container">
                        {renderAgentSuggestions}
                    </section>}
            </form>
        </div>
        <section className="agent-individual-section">
            <div className="agent-columns-headers">
                <p>Agent</p>
                <p>Role</p>
                <p>Species</p>
                <p>From</p>
                <p>Released</p>
            </div>
            {allUserGuessesAgent.length > 0 && renderAgentGuess}
        </section>
    </div>)
}

export default Agent;