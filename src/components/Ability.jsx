import React from 'react'
import { useEffect, useState } from 'react'
import "./Ability.css"

const Ability = () => {

    const [allAgents, setAllAgents] = useState([]);
    console.log(allAgents)

    useEffect(() => {
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
                setAllAgents(filteredArray)
            })


    }, [])

    return (
        <div className='ability-page'>
            <section className='ability-upper-section'>
                <h2 className='header2-ability-page'>GUESS WHICH AGENT HAS THE ABILITY</h2>
                <div>
                    <img src="" alt="" />
                </div>
                <form action="">
                    <input type="text" />
                    <button>{">"}</button>
                </form>
            </section>
        </div>
    )
}

export default Ability