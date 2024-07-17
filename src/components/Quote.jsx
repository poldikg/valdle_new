import React from 'react'
import "./Quote.css"
import { useState, useEffect } from 'react'
import AgentData from './AgentData'

const Quote = () => {

    const [allQuotes, setAllQuotes] = useState([]);
    const [quoteIndex, setQuoteIndex] = useState();
    const [agentIndex, setAgentIndexQuote] = useState();
    const [userGuessQuote, setUserGuessQuote] = useState("");
    console.log(userGuessQuote)
    const filterQuotes = AgentData.map(agent => {
        return {
            agentName: agent.agentName,
            agentIcon: agent.agentIcon,
            agentQuotes: agent.agentVoicelinesAudio
        }
    });
    useEffect(() => {
        const getAgentIndex = localStorage.getItem("QuoteAgentIndex") ? localStorage.getItem("QuoteAgentIndex") : undefined;
        const getQuoteIndex = localStorage.getItem("QuoteQuoteIndex") ? localStorage.getItem("QuoteQuoteIndex") : undefined;

        setAllQuotes(filterQuotes);
        if (getAgentIndex === undefined || getQuoteIndex === undefined) {
            const randomAgentIndex = Math.floor(Math.random() * AgentData.length);
            const randomQuoteIndex = Math.floor(Math.random() * AgentData[randomAgentIndex].agentVoicelinesAudio.length);
            const quoteTaskCreated = new Date();
            localStorage.setItem("QuoteAgentIndex", randomAgentIndex);
            localStorage.setItem("QuoteQuoteIndex", randomQuoteIndex);
            localStorage.setItem("QuoteTaskCreated", quoteTaskCreated);
            setAgentIndexQuote(randomAgentIndex);
            setQuoteIndex(randomQuoteIndex);

        } else if (getAgentIndex && getQuoteIndex) {
            setAgentIndexQuote(JSON.parse(getAgentIndex));
            setQuoteIndex(JSON.parse(getQuoteIndex));
        }



    }, [])

    const saveUserGuessQuote = (event) => {
        const userInput = event.target.value;
        const upperCaseFirstLetter = userInput.charAt(0).toUpperCase() + userInput.slice(1);
        setUserGuessQuote(upperCaseFirstLetter)
    }


    return (
        <div>
            <section className='quote-upper-section'>
                <h1 className='quote-header1'>GUESS THE QUOTE</h1>
                <div className='quote-quote-holder'>
                    <p className='quote-quote-text'>
                        "{allQuotes.length >= 1 && allQuotes[agentIndex].agentQuotes[quoteIndex].voiceline}"
                    </p>
                </div>
                <form action="">
                    <div className='quote-input-container'>
                        <input type="text" placeholder='Type a guess ' onChange={(event) => saveUserGuessQuote(event)} />
                        <button > {">"} </button>
                    </div>
                </form>
            </section>
        </div>

    )
}

export default Quote