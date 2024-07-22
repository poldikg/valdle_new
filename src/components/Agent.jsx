import React from "react";
import "./Agent.css"
import AgentData from "./AgentData";
import PopupRightGuess from "./PopupRightGuess";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";


const Agent = () => {

    const [agentData, setAgentData] = useState([]);
    const [agentAbilities, setAgentAbilities] = useState([]);
    const [agentIndex, setAgentIndex] = useState();
    const [agentQuoteIndex, setAgentQuoteIndex] = useState();
    const [agentAbilityIndex, setAgentAbilityIndex] = useState();
    const [userGuessAgent, setUserGuessAgent] = useState("");
    const [allUserGuessesAgent, setAllUserGuessesAgent] = useState([]);
    const [nrUserGuesses, setNrUserGuesses] = useState(0);
    const [userGuessedAgent, setUserGuessedAgent] = useState(false);
    const [eachAgentInfo, setEachAgentInfo] = useState([]);
    const [suggestedAgents, setSuggestedAgents] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showHint, setShowHint] = useState({ hintQuote: false, hintAbility: false });
    const [opacityStates, setOpacityStates] = useState(Array(allUserGuessesAgent.length).fill(false));
    console.log(agentAbilities)


    const styleChangeOpacity = { opacity: "1", transition: "opacity 1s ease-in 2s" }

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

    const styleHintDisabled = {
        backgroundColor: "#453F40"
    };

    const styleHintEnabled = {
        backgroundColor: "#D2404D"
    }

    const showHints = (hintName) => {

        if (hintName === "Quote" && (nrUserGuesses - 3 >= 0) || hintName === "Quote" && userGuessedAgent) {
            setShowHint(prevState => {
                return {
                    hintAbility: false,
                    hintQuote: !prevState.hintQuote
                }
            })
        }
        else if (hintName === "Ability" && (nrUserGuesses - 6 >= 0) || hintName === "Ability" && userGuessedAgent) {
            setShowHint(prevState => {
                return {
                    hintAbility: !prevState.hintAbility,
                    hintQuote: false
                }
            })
        }
    }

    const submitAgentSuggestion = (agentName) => {
        setUserGuessAgent(agentName)
    }

    const FilterAgents = (agent) => {
        if (userGuessAgent !== "" && agent.agentName.slice(0, userGuessAgent.length) === userGuessAgent.charAt(0).toUpperCase() + userGuessAgent.slice(1)) {
            return agent;
        }

    }

    useEffect(() => {

        fetch("https://valorant-api.com/v1/agents")
            .then(res => res.json())
            .then(data => {
                const agentAbilities = data.data.filter(agent => agent.isPlayableCharacter === true).map(agent => {
                    return {
                        agentName: agent.displayName,
                        agentAbilities: agent.abilities
                    }
                });
                setAgentAbilities(agentAbilities)
            })
    }, [])

    useEffect(() => {
        const getRightGuessPopup = document.querySelector(".popup-rightguess");
        userGuessedAgent ? getRightGuessPopup.scrollIntoView() : "";

    }, [userGuessedAgent])

    useEffect(() => {
        const agentNamesLetter = agentData.map(agent => agent.agentName[0])

        if (agentNamesLetter.includes(userGuessAgent.charAt(0).toUpperCase())) {
            setShowSuggestions(true);
        }
        else {
            setShowSuggestions(false);
        }

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
        const getAgentIndex = localStorage.getItem("AgentIndex") ? localStorage.getItem("AgentIndex") : null;
        const getUserGuesses = localStorage.getItem("allUserAgentGuesses") ? JSON.parse(localStorage.getItem("allUserAgentGuesses")) : [];
        const randomAgentIndex = Math.floor(Math.random() * (AgentData.length));
        const getUserCorrectGuessAgent = JSON.parse(localStorage.getItem("userGuessedAgentCorrectly"));
        const getQuoteIndex = localStorage.getItem("AgentQuoteIndex") ? localStorage.getItem("AgentQuoteIndex") : undefined;
        const getAbilityIndex = localStorage.getItem("AgentAbilityIndex") ? localStorage.getItem("AgentAbilityIndex") : undefined;
        setAgentQuoteIndex(parseInt(getQuoteIndex));
        setAgentAbilityIndex(parseInt(getAbilityIndex));


        if (getAgentIndex) {
            setAllUserGuessesAgent(getUserGuesses)
            setAgentIndex(parseInt(getAgentIndex))
            setNrUserGuesses(getUserGuesses === null ? nrUserGuesses : getUserGuesses.length)

            if (getUserCorrectGuessAgent) {
                const inputAgent = document.querySelector(".agent-input");
                const inputButtonAgent = document.querySelector(".agent-submit-button");
                inputAgent.setAttribute("disabled", true);
                inputButtonAgent.setAttribute("disabled", true);
                inputAgent.setAttribute("placeholder", "TRY AGAIN TOMORROW!")
                setUserGuessedAgent(true)
            }
        }
        else {
            localStorage.setItem("AgentIndex", randomAgentIndex)
            setAgentIndex(randomAgentIndex);
            const agentTaskCreated = new Date();
            localStorage.setItem("AgentTaskCreated", agentTaskCreated)
        }



        console.log("Mounted agent")
    }, [])

    const changeUserGuessAgent = (event) => {
        setUserGuessAgent(event.target.value)
    }

    const handleFormSubmitAgent = (event) => {
        console.log(event);
        event.preventDefault();
        event.target[0].value = "";

        const userGuessAgentTrue = userGuessAgent.toLowerCase() === agentData[agentIndex]["agentName"].toLowerCase()
        const agentNames = agentData.map(agent => agent.agentName);

        if (nrUserGuesses === 0) {
            const randomIndexAgentQuote = Math.floor(Math.random() * AgentData[agentIndex].agentVoicelines.length);
            localStorage.setItem("AgentQuoteIndex", randomIndexAgentQuote);
            setAgentQuoteIndex(randomIndexAgentQuote);
        }

        if (nrUserGuesses === 1) {
            const randomIndexAgentAbility = Math.floor(Math.random() * agentAbilities[agentIndex].agentAbilities.length);
            localStorage.setItem("AgentAbilityIndex", randomIndexAgentAbility);
            setAgentAbilityIndex(randomIndexAgentAbility);
        }

        if (!agentNames.includes(userGuessAgent.charAt(0).toUpperCase() + userGuessAgent.slice(1))) {
            setUserGuessAgent("")
            return false;
        }


        for (let i = 0; i < allUserGuessesAgent.length; i++) {
            if (allUserGuessesAgent[i].agentName.includes(userGuessAgent.charAt(0).toUpperCase() + userGuessAgent.slice(1))) {
                setUserGuessAgent("");
                return false;
            }
        }


        if (userGuessAgentTrue) {
            setUserGuessedAgent(true);
            localStorage.setItem("userGuessedAgentCorrectly", userGuessAgentTrue);
            event.target[0].disabled = true;
            event.target[0].textContent = "TRY AGAIN TOMORROW";
            event.target[1].disabled = true;
        }

        if (userGuessAgent === undefined) {
            return false;
        }

        if (userGuessAgent) {// The condition could be removed, test tomorrow.
            console.log("I am here")
            for (let i = 0; i < agentData.length; i++) {
                if (agentData[i].agentName.toLowerCase() === userGuessAgent.toLowerCase()) {

                    setAllUserGuessesAgent(prevState => {
                        return [{
                            agentName: agentData[i].agentName,
                            agentIcon: agentData[i].agentIcon,
                            agentRole: agentData[i].agentRole,
                            agentSpecies: agentData[i].agentSpecies,
                            agentCountry: agentData[i].agentCountry,
                            agentReleaseDate: agentData[i].agentReleaseDate,
                            agentData: [agentData[i].agentIcon, agentData[i].agentRole, agentData[i].agentSpecies, agentData[i].agentCountry, agentData[i].agentReleaseDate]
                        }, ...prevState
                        ];
                    })
                    localStorage.setItem("allUserAgentGuesses", JSON.stringify([{
                        agentName: agentData[i].agentName,
                        agentIcon: agentData[i].agentIcon,
                        agentRole: agentData[i].agentRole,
                        agentSpecies: agentData[i].agentSpecies,
                        agentCountry: agentData[i].agentCountry,
                        agentReleaseDate: agentData[i].agentReleaseDate,
                        agentData: [agentData[i].agentIcon, agentData[i].agentRole, agentData[i].agentSpecies, agentData[i].agentCountry, agentData[i].agentReleaseDate]

                    }, ...allUserGuessesAgent
                    ]));

                }
            }



        }


        // const randomIndexAgentAbility =  Math.floor(Math.random() * agentData[agentIndex].agentVoicelines.length);
        // local
        setNrUserGuesses(prevState => prevState + 1);
        setUserGuessAgent("")


    }


    const checkStyle = (agentInfo) => {
        if (agentInfo === agentData[agentIndex].agentRole
            || agentInfo === agentData[agentIndex].agentSpecies
            || agentInfo === agentData[agentIndex].agentCountry
            || agentInfo === agentData[agentIndex].agentReleaseDate
        ) {
            return styleRightGuess
        } else {
            return styleWrongGuess
        }

    }

    const renderAgentGuess = allUserGuessesAgent.map((agent, i) => {
        return agent.agentName === agentData[agentIndex].agentName ?
            <div key={agent.agentName} className="agent-individual">
                {agent.agentData.map((data, i) => <motion.div style={styleRightGuess}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: userGuessedAgent ? 0 : 0.8,
                        delay: userGuessedAgent ? 0 : i - 0.5,
                        ease: [0, 0.71, 0.2, 1.01],

                    }}> {data.includes("https") ? <div className="agent-agent-detail"> <img className="agent-img" src={data}></img></div> : <div>{data}</div>} </motion.div>)}
            </div>
            :
            <div key={agent.agentName} className="agent-individual">
                {agent.agentData.map((data, i) => <motion.div style={checkStyle(data)}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                        duration: userGuessedAgent ? 0 : 0.8,
                        delay: userGuessedAgent ? 0 : i - 0.5,
                        ease: [0, 0.71, 0.2, 1.01],

                    }}>{data.includes("https") ? <div className="agent-agent-detail"><img className="agent-img" src={data}></img></div> : <div>{data}</div>}</motion.div>

                )}
            </div>
    });

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
                <section>
                    <div className="hint-section">
                        <div className="hint">
                            <div className="hint-button" style={(3 - nrUserGuesses) <= 0 || userGuessedAgent ? styleHintEnabled : styleHintDisabled} onClick={() => showHints("Quote")}>
                                <img src="../agent-abilities/double-quote-noborder-disabled.png" alt="" srcset="" />
                            </div>
                            {(3 - nrUserGuesses) <= 0 || userGuessedAgent ? <p>Show a quote clue.</p> : <p>Quote clue in {3 - nrUserGuesses} tries.</p>}
                        </div>
                        <div className="hint" >
                            <div className="hint-button" style={(6 - nrUserGuesses) <= 0 || userGuessedAgent ? styleHintEnabled : styleHintDisabled} onClick={() => showHints("Ability")}>
                                <img id="agent-ability-hint-image" src="../agent-abilities/brim-ult-disabled.png" alt="" srcset="" />
                            </div>
                            {(6 - nrUserGuesses) <= 0 || userGuessedAgent ? <p>Show ability clue.</p> : <p>Ability clue in {6 - nrUserGuesses} tries.</p>}
                        </div>
                    </div>
                    {showHint.hintAbility ? <section className="agent-hint-show"> <img src={agentAbilities[agentIndex].agentAbilities[agentAbilityIndex].displayIcon} alt="" srcset="" /> <p>{agentAbilities[agentIndex].agentAbilities[agentAbilityIndex].displayName}</p> </section>
                        : showHint.hintQuote ? <section className="agent-hint-show"> {agentData[agentIndex].agentVoicelines[agentQuoteIndex]} </section> : ""}
                </section>

                <form action="" onSubmit={handleFormSubmitAgent}>
                    <div className="form-section-input">
                        <input className="agent-input" type="text" placeholder={userGuessedAgent ? "TRY AGAIN TOMORROW" : "Type your guess"} onChange={changeUserGuessAgent} />
                        <button className="agent-submit-button"> {">"}</button>
                    </div>
                    {suggestedAgents.length >= 1 && <section className="suggest-agent-container">
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
            {userGuessedAgent && <PopupRightGuess
                image={agentData[agentIndex].agentIcon}
                name={agentData[agentIndex].agentName.toUpperCase()}
                nrTries={allUserGuessesAgent.length}
                rightAbility=""
                allAbilities={[]}
                currentPage={"Agent"}
                nextPage={"Skin"}
            />}
        </div>)
}

export default Agent;