import React from 'react'
import { useEffect, useState } from 'react'
import "./Ability.css"

const Ability = () => {

    const [allAgents, setAllAgents] = useState([]);
    const [agentIndex, setAgentIndex] = useState();
    const [abilityIndex, setAbilityIndex] = useState();
    const [abilityUserGuess, setAbilityUserGuess] = useState("");
    const [imageBlur, setImageBlur] = useState(5);
    const [randomAngle, setRandomAngle] = useState()

    console.log(abilityUserGuess)

    const imageDifficulty = { filter: `blur(${imageBlur}px)`, transform: `rotate(${randomAngle}deg)` };

    useEffect(() => {

        const getAgentIndex = localStorage.getItem("AbilityIndex") ? localStorage.getItem("AbilityIndex") : undefined;
        const getAgentAbilityIndex = localStorage.getItem("AbilityAbilityIndex") ? localStorage.getItem("AbilityAbilityIndex") : undefined;
        const getRandomAngle = localStorage.getItem("AbilityRandomAngle") ? localStorage.getItem("AbilityRandomAngle") : undefined;


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
                    setAgentIndex(JSON.parse(getAgentIndex));
                    setAbilityIndex(JSON.parse(getAgentAbilityIndex));
                    setRandomAngle(JSON.parse(getRandomAngle));
                }
            })
    }, [])

    const saveUserGuess = (event) => {
        setAbilityUserGuess(event.target.value)
    }

    return (
        <div className='ability-page'>
            <section className='ability-upper-section'>
                <h2 className='header2-ability-page'>GUESS WHICH AGENT HAS THE ABILITY</h2>
                <div className='ability-image-container'>
                    {allAgents.length >= 1 && <img style={imageDifficulty} src={allAgents[agentIndex].agentAbilities[abilityIndex].displayIcon} alt="" draggable="false" />}
                </div>
                <form action="">
                    <div className='ability-input-container'>
                        <input type="text" onChange={(event) => { saveUserGuess(event) }} />
                        <button>{">"}</button>
                    </div>
                </form>
            </section>
        </div>
    )
}

export default Ability