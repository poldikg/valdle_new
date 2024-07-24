import React from 'react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import PopupRightGuess from "./PopupRightGuess.jsx"
import "./Ability.css"


const Ability = () => {

    const [allAgents, setAllAgents] = useState([]);
    const [agentIndex, setAgentIndex] = useState();
    const [abilityIndex, setAbilityIndex] = useState();
    const [abilityUserGuess, setAbilityUserGuess] = useState("");
    const [allAbilityUserGuesses, setAllAbilityUserGuesses] = useState([]);
    const [imageBlur, setImageBlur] = useState(5);
    const [randomAngle, setRandomAngle] = useState();
    const [abilityAgentSuggestions, setAbilityAgentSuggestions] = useState([]);
    const [userGuessedAbilityCorrectly, setUserGuessedAbilityCorrectly] = useState(false);
    const [hideFirstPart, setHideFirstPart] = useState(false);
    console.log(allAgents)


    const rightAbilityGuess = { backgroundColor: "#16AC25" };
    const wrongAbilityGuess = { backgroundColor: "#D2404D" };

    const imageDifficulty = { filter: `blur(${imageBlur}px)`, transform: `rotate(${randomAngle}deg)` };

    useEffect(() => {

        if (abilityUserGuess.length >= 1) {
            const filteredSuggestions = allAgents.filter(agent => agent.agentName.slice(0, abilityUserGuess.length) === abilityUserGuess).map(agent => {
                return {
                    agentName: agent.agentName,
                    agentIcon: agent.agentIcon
                }
            });
            setAbilityAgentSuggestions(filteredSuggestions);
        }
        else if (abilityUserGuess === "") {
            setAbilityAgentSuggestions([]);
        }


    }, [abilityUserGuess])

    useEffect(() => {

        const getAgentIndex = localStorage.getItem("AbilityIndex") ? localStorage.getItem("AbilityIndex") : undefined;
        const getAgentAbilityIndex = localStorage.getItem("AbilityAbilityIndex") ? localStorage.getItem("AbilityAbilityIndex") : undefined;
        const getRandomAngle = localStorage.getItem("AbilityRandomAngle") ? localStorage.getItem("AbilityRandomAngle") : undefined;
        const getUserGuessesAbility = localStorage.getItem("allUserAbilityGuesses") ? JSON.parse(localStorage.getItem("allUserAbilityGuesses")) : [];
        const getImageBlur = localStorage.getItem("AbilityImageBlur") ? localStorage.getItem("AbilityImageBlur") : undefined;
        const getRightUserGuess = JSON.parse(localStorage.getItem("userGuessedAbilityCorrectly")) ? JSON.parse(localStorage.getItem("userGuessedAbilityCorrectly")) : false;
        const getHideFirstPart = localStorage.getItem("AbilityHideFirstPart") ? JSON.parse(localStorage.getItem("AbilityHideFirstPart")) : false;
        console.log(getRightUserGuess)


        fetch("https://valorant-api.com/v1/agents")
            .then(res => res.json())
            .then(data => {
                const filteredArray = data.data.filter(agent => agent.isPlayableCharacter === true).map(agent => {
                    return {
                        agentName: agent.displayName,
                        agentIcon: agent.displayIcon,
                        agentAbilities: agent.abilities
                    }
                });
                setAllAgents(filteredArray);

                if (getAgentIndex === undefined || getAgentAbilityIndex === undefined) {
                    const randomAngle = Math.floor(Math.random() * 360);
                    const randomAgentIndex = Math.floor(Math.random() * filteredArray.length);
                    const randomAbilityIndex = Math.floor(Math.random() * filteredArray[randomAgentIndex].agentAbilities.length);
                    const abilityTaskCreated = new Date();
                    console.log(abilityTaskCreated)
                    console.log(randomAgentIndex, randomAbilityIndex);
                    setAgentIndex(randomAgentIndex);
                    setAbilityIndex(randomAbilityIndex);
                    setRandomAngle(randomAngle)
                    localStorage.setItem("AbilityAbilityIndex", randomAbilityIndex);
                    localStorage.setItem("AbilityIndex", randomAgentIndex);
                    localStorage.setItem("AbilityTaskCreated", abilityTaskCreated);
                    localStorage.setItem("AbilityRandomAngle", randomAngle);
                }
                else {
                    if (getRightUserGuess) {
                        const getInputTextAbility = document.querySelector(".ability-input-text");
                        const getInputButtonAbility = document.querySelector(".ability-input-button");
                        getInputTextAbility.setAttribute("disabled", true);
                        getInputButtonAbility.setAttribute("disabled", true);
                        getInputTextAbility.setAttribute("placeholder", "TRY AGAIN TOMORROW");
                    }

                    setAllAbilityUserGuesses(getUserGuessesAbility);
                    setAgentIndex(JSON.parse(getAgentIndex));
                    setAbilityIndex(JSON.parse(getAgentAbilityIndex));
                    setRandomAngle(JSON.parse(getRandomAngle));
                    setImageBlur(JSON.parse(getImageBlur));
                    setHideFirstPart(getRightUserGuess);
                    setUserGuessedAbilityCorrectly(getRightUserGuess);
                }
            })
    }, [])

    useEffect(() => {

        if (userGuessedAbilityCorrectly) {
            const getRightPopupGuess = document.querySelector(".popup-rightguess");
            getRightPopupGuess.scrollIntoView();
        }

    }, [userGuessedAbilityCorrectly])

    const saveUserGuess = (event) => {
        const upperCasedUserGuess = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1);
        setAbilityUserGuess(upperCasedUserGuess);
    }

    const handleSubmitAbility = (event) => {
        event.preventDefault();
        event.target[0].value = "";
        console.log(event)

        const agentNames = allAgents.map(agent => agent.agentName);

        if (!agentNames.includes(abilityUserGuess)) {
            setAbilityUserGuess("");
            return false;
        }

        if (abilityUserGuess !== "") {
            for (let i = 0; i < allAbilityUserGuesses.length; i++) {
                if (allAbilityUserGuesses[i].agentName.includes(abilityUserGuess)) {
                    setAbilityUserGuess("");
                    return false;
                }
            }
        }

        if (abilityUserGuess !== "") {
            for (let agentIndex in allAgents) {
                console.log(allAgents[agentIndex].agentName.includes(abilityUserGuess))
                if (allAgents[agentIndex].agentName.includes(abilityUserGuess)) {
                    setImageBlur(prevState => prevState - 1)
                    localStorage.setItem("AbilityImageBlur", imageBlur - 1)
                    setAllAbilityUserGuesses(prevState => { return [allAgents[agentIndex], ...prevState] });
                    localStorage.setItem("allUserAbilityGuesses", JSON.stringify([allAgents[agentIndex], ...allAbilityUserGuesses]));
                    setAbilityUserGuess("");
                }
            }
        }

        if (abilityUserGuess === allAgents[agentIndex].agentName) {
            event.target[0].disabled = true;
            event.target[1].disabled = true;
            event.target[0].placeholder = "TRY AGAIN TOMORROW";
            localStorage.setItem("userGuessedAbilityCorrectly", true);
            setUserGuessedAbilityCorrectly(true);
        }

    }

    const renderUserAbilityGuesses = allAbilityUserGuesses.map(guess => {
        return guess.agentName === allAgents[agentIndex].agentName ? <motion.div key={guess.agentName} style={rightAbilityGuess} className='ability-user-guess'
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: userGuessedAbilityCorrectly ? 0 : 0.7,
                delay: userGuessedAbilityCorrectly ? 0 : 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}>
            <img src={guess.agentIcon} alt="Agent image" draggable="false" />
            <p>{guess.agentName}</p>
        </motion.div > : <motion.div key={guess.agentName} style={wrongAbilityGuess} className='ability-user-guess'
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: userGuessedAbilityCorrectly ? 0 : 0.7,
                delay: userGuessedAbilityCorrectly ? 0 : 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}>
            <img src={guess.agentIcon} alt="Agent image" draggable="false" />
            <p>{guess.agentName}</p>
        </motion.div>
    });

    const sendSuggestionToInput = (agentName) => {
        setAbilityUserGuess(agentName);
    }

    const disableFirstPart = () => {
        setHideFirstPart(true);
        localStorage.setItem("AbilityHideFirstPart", true)
    }

    const showFirstPart = () => {
        setHideFirstPart(false);
        localStorage.setItem("AbilityHideFirstPart", false);
    }

    const renderAbilityAgentSuggestions = abilityAgentSuggestions.map(suggestion => {
        return <button className='ability-agent-suggestion' onClick={() => sendSuggestionToInput(suggestion.agentName)} >
            <img src={suggestion.agentIcon} alt="" srcset="" />
            <p>{suggestion.agentName}</p>
        </button>
    });

    return (
        <div className='ability-page'>
            <section className='ability-upper-section'>
                <h2 className='header2-ability-page'>GUESS WHICH AGENT HAS THE ABILITY</h2>
                <div className='ability-image-container'>
                    {allAgents.length >= 1 && <img style={imageBlur <= 0 || userGuessedAbilityCorrectly ? { transform: "rotate(0deg)" } : imageDifficulty} src={allAgents[agentIndex].agentAbilities[abilityIndex].displayIcon} alt="" draggable="false" />}
                </div>
                <p className='ability-reveal-image'>{imageBlur <= 0 || userGuessedAbilityCorrectly ? "Ability revealed." : `Full ability reveal after ${imageBlur} tries.`}</p>
                <form onSubmit={(event) => handleSubmitAbility(event)}>
                    <div className='ability-input-container' style={userGuessedAbilityCorrectly ? { display: "none" } : { display: "flex" }}>
                        <input className='ability-input-text' type="text" placeholder="Type your guess" onChange={(event) => { saveUserGuess(event) }} />
                        <button className='ability-input-button'>{">"}</button>
                    </div>
                    {abilityAgentSuggestions.length >= 1 && <div className='ability-agent-suggestions-container'>
                        {renderAbilityAgentSuggestions}
                    </div>}
                </form>
            </section>
            <section className='ability-all-user-guesses'>
                {renderUserAbilityGuesses}
            </section>

            {userGuessedAbilityCorrectly && <PopupRightGuess
                image={allAgents[agentIndex].agentIcon}
                name={allAgents[agentIndex].agentName}
                nrTries={allAbilityUserGuesses.length}
                rightAbility={allAgents[agentIndex].agentAbilities[abilityIndex].displayName}
                allAbilities={allAgents[agentIndex].agentAbilities}
                currentPage={"Ability"}
                nextPage={"Quote"}
            />}
        </div>
    )
}

export default Ability