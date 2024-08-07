import React from 'react'
import "./Quote.css"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AgentData from './AgentData'
import PopupRightGuess from './PopupRightGuess'
import voiceline from "./agentsVoicelines/Gekko/Gekko-1.mp3"

const Quote = () => {

    const [allQuotes, setAllQuotes] = useState([]);
    const [quoteIndex, setQuoteIndex] = useState();
    const [agentIndex, setAgentIndexQuote] = useState();
    const [userGuessQuote, setUserGuessQuote] = useState("");
    const [allUserGuessesQuote, setAllUserGuessesQuote] = useState([]);
    const [userGuessedCorrectlyQuote, setUserGuessedCorrectlyQuote] = useState(false);
    const [agentSuggestions, setAgentSuggestions] = useState([]);
    const [playAudio, setPlayAudio] = useState(2);
    const [audioHint, setAudioHint] = useState(0);
    console.log(playAudio)

    const filterQuotes = AgentData.map(agent => {
        return {
            agentName: agent.agentName,
            agentIcon: agent.agentIcon,
            agentQuotes: agent.agentVoicelinesAudio
        }
    });

    const rightStyleGuess = { backgroundColor: "#16AC25" };
    const wrongStyleGuess = { backgroundColor: "#D2404D" };

    useEffect(() => {
        const getAgentIndex = localStorage.getItem("QuoteAgentIndex") ? localStorage.getItem("QuoteAgentIndex") : undefined;
        const getQuoteIndex = localStorage.getItem("QuoteQuoteIndex") ? localStorage.getItem("QuoteQuoteIndex") : undefined;
        const getAllUserGuessesQuote = localStorage.getItem("allUserQuoteGuesses") ? JSON.parse(localStorage.getItem("allUserQuoteGuesses")) : [];
        const getUserRightGuess = localStorage.getItem("userGuessedQuoteCorrectly") ? JSON.parse(localStorage.getItem("userGuessedQuoteCorrectly")) : false;
        const getAudioHint = localStorage.getItem("QuoteAudioHint") ? localStorage.getItem("QuoteAudioHint") : 0;

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

            if (getUserRightGuess) {
                const getInputText = document.querySelector(".quote-input-text");
                const getInputButton = document.querySelector(".quote-input-button");
                getInputText.setAttribute("disabled", true);
                getInputButton.setAttribute("disabled", true);
                getInputText.setAttribute("placeholder", "TRY AGAIN TOMORROW");
                setUserGuessedCorrectlyQuote(getUserRightGuess);
            }
            setAudioHint(JSON.parse(getAudioHint));
            setAgentIndexQuote(JSON.parse(getAgentIndex));
            setQuoteIndex(JSON.parse(getQuoteIndex));
            setAllUserGuessesQuote(getAllUserGuessesQuote)
        }

    }, [])

    useEffect(() => {
        if (userGuessedCorrectlyQuote) {
            const getRightGuessPopup = document.querySelector(".popup-rightguess")
            getRightGuessPopup.scrollIntoView("")
        }
    }, [userGuessedCorrectlyQuote])

    useEffect(() => {
        if (userGuessQuote.length >= 1) {
            const renderSuggestions = allQuotes.filter(agent => agent.agentName.slice(0, userGuessQuote.length) === userGuessQuote).map(agent => {
                return {
                    agentName: agent.agentName,
                    agentIcon: agent.agentIcon
                }
            })
            setAgentSuggestions(renderSuggestions)
        } else if (userGuessQuote === "") {
            setAgentSuggestions([]);
        }
    }, [userGuessQuote])


    const handleSubmitQuote = (event) => {
        event.preventDefault();
        event.target[0].value = "";

        const agentNames = allQuotes.map(agent => agent.agentName);
        const allAgentsFilteredRender = allQuotes.map(agent => {
            return {
                agentName: agent.agentName,
                agentIcon: agent.agentIcon
            }
        });

        if (!agentNames.includes(userGuessQuote)) {
            setUserGuessQuote("");
            return false;
        }

        for (let i = 0; i < allUserGuessesQuote.length; i++) {
            if (allUserGuessesQuote[i].agentName.includes(userGuessQuote)) {
                setUserGuessQuote("")
                return false;
            }
        }

        for (let i = 0; i < allQuotes.length; i++) {
            if (allQuotes[i].agentName.includes(userGuessQuote)) {
                setAllUserGuessesQuote(prevState => { return [allAgentsFilteredRender[i], ...prevState] })
                setAudioHint(prevState => prevState + 1);
                localStorage.setItem("QuoteAudioHint", audioHint + 1)
                localStorage.setItem("allUserQuoteGuesses", JSON.stringify([allAgentsFilteredRender[i], ...allUserGuessesQuote]))
            }
        }

        if (userGuessQuote === allQuotes[agentIndex].agentName) {
            setUserGuessQuote("");
            setUserGuessedCorrectlyQuote(true);
            event.target[0].disabled = true;
            event.target[1].disabled = true;
            event.target[0].placeholder = "TRY AGAIN TOMORROW";
            localStorage.setItem("userGuessedQuoteCorrectly", true);
        }

        setUserGuessQuote("");


    }

    const saveUserGuessQuote = (event) => {
        const userInput = event.target.value;
        const upperCaseFirstLetter = userInput.charAt(0).toUpperCase() + userInput.slice(1);
        setUserGuessQuote(upperCaseFirstLetter);
    }

    const renderUserQuoteGuesses = allUserGuessesQuote.map(guess => {
        return guess.agentName === allQuotes[agentIndex].agentName ? <motion.div key={guess.agentName} style={rightStyleGuess} className='quote-guess-container'
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: userGuessedCorrectlyQuote ? 0 : 0.7,
                delay: userGuessedCorrectlyQuote ? 0 : 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}>
            <img src={guess.agentIcon} alt="" srcset="" />
            <p>{guess.agentName}</p>
        </motion.div> : <motion.div key={guess.agentName} style={wrongStyleGuess} className='quote-guess-container'
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: userGuessedCorrectlyQuote ? 0 : 0.7,
                delay: userGuessedCorrectlyQuote ? 0 : 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }}>
            <img src={guess.agentIcon} alt="" srcset="" />
            <p>{guess.agentName}</p>
        </motion.div>
    }
    )

    const sendAgentToInput = (agentName) => {
        setUserGuessQuote(agentName)
    }

    const renderAgentSuggestions = agentSuggestions.map(suggestion => <button onClick={() => sendAgentToInput(suggestion.agentName)}>
        <img src={suggestion.agentIcon} alt="" srcset="" />
        <p>{suggestion.agentName}</p>
    </button>)

    const playVoiceline = () => {

        const audioToRun = new Audio(allQuotes[agentIndex].agentQuotes[quoteIndex].audio);

        if (playAudio % 2 === 0) {
            audioToRun.play();
        }
        else { //Doesn't work
            audioToRun.pause();
        }
        setPlayAudio(prevState => prevState + 1)
    }

    // const testDateYear = new Date().getFullYear()
    // const testDateMonth = new Date().getMonth();
    // const testDateDate = new Date().getDate() + 1;
    // const testDateHour = new Date().getHours();
    // const testDateMinutes = new Date().getMinutes();
    // const testDateSeconds = new Date().getSeconds();
    // const testDate = new Date(testDateYear, testDateMonth, testDateDate, testDateHour, testDateMinutes, testDateSeconds);
    // const getExistingDate = new Date(localStorage.getItem("QuoteTaskCreated"))

    // const secondsDifference = Math.floor((testDate - (getExistingDate)) / 1000);
    // const minutesDifference = Math.floor(secondsDifference / 60);
    // const hoursDifference = Math.floor(minutesDifference / 60);
    // const daysDifference = Math.floor(hoursDifference / 24);



    // const newHoursDifference = hoursDifference - (daysDifference * 24);
    // const newMinutesDifference = minutesDifference - (daysDifference * 24 * 60) - (hoursDifference * 60);
    // const newSecondsDifference = secondsDifference - (daysDifference * 24 * 60 * 60) - (hoursDifference * 60 * 60) - (minutesDifference * 60);

    // console.log(newHoursDifference, newMinutesDifference, newSecondsDifference)
    // console.log(testDate, getExistingDate)


    return (
        <div className='quote-page'>
            <section className='quote-upper-section'>
                <h1 className='quote-header1'>GUESS THE QUOTE</h1>
                <div className='quote-quote-holder'>
                    <p className='quote-quote-text'>
                        "{allQuotes.length >= 1 && allQuotes[agentIndex].agentQuotes[quoteIndex].voiceline}"
                    </p>
                </div>
                <p className='quote-audio-hint-text'>{3 - audioHint <= 0 || userGuessedCorrectlyQuote ? "Click to play the audio." : `Audio hint in ${3 - audioHint} tries.`}</p>
                {3 - audioHint <= 0 || userGuessedCorrectlyQuote && <div onClick={() => playVoiceline()} className='quote-play-audio'> <img src="agent-abilities/play-button.png" alt="" srcset="" /></div>}
                <form onSubmit={(event) => handleSubmitQuote(event)}>
                    <div className='quote-input-container' style={userGuessedCorrectlyQuote ? { display: "none" } : { display: "flex" }}>
                        <input className='quote-input-text' type="text" placeholder='Type your guess' onChange={(event) => saveUserGuessQuote(event)} />
                        <button className='quote-input-button'> {">"} </button>
                    </div>

                    {agentSuggestions.length >= 1 && <div className='quote-agent-suggestions'>
                        {renderAgentSuggestions}
                    </div>}
                </form>
            </section>
            <section className='quote-lower-section'>
                {renderUserQuoteGuesses}
            </section>
            {userGuessedCorrectlyQuote && <PopupRightGuess
                image={allQuotes[agentIndex].agentIcon}
                name={allQuotes[agentIndex].agentName}
                nrTries={allUserGuessesQuote.length}
                rightAbility={""}
                allAbilities={[]}
                currentPage={"Quote"}
                nextPage={"None"}
            />}
        </div>

    )
}

export default Quote