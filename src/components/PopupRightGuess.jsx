import React from 'react'
import { useState, useEffect } from 'react'
import "./PopupRightGuess.css"
import { Link } from 'react-router-dom'

const PopupRightGuess = (props) => {

    console.log(props)
    const [userGuessedAbilityName, setUserGuessedAbilityName] = useState(false);
    const [userBeatBonusGame, setUserBeatBonusGame] = useState(false);
    console.log(userGuessedAbilityName, userBeatBonusGame)




    const renderAllAbilities = props.allAbilities.map(ability => {
        return userGuessedAbilityName ? <button className="ability-bonus-game-guess"
            style={ability.displayName === props.rightAbility ? { backgroundColor: "#0A6113" } : { backgroundColor: "#D2404D " }}
            onClick={() => checkUserGuess(ability.displayName, event)}> {ability.displayName}  </button> :
            <button className="ability-bonus-game-guess"
                style={{ backgroundColor: "#898989" }}
                onClick={() => checkUserGuess(ability.displayName, event)}> {ability.displayName} </button>
    })

    const checkUserGuess = (userGuess, event) => {
        setUserGuessedAbilityName(true);
        localStorage.setItem("AbilityBonusGameUserGuessed", true);
        if (props.rightAbility === userGuess) {
            setUserBeatBonusGame(true);
            localStorage.setItem("AbilityBonusGameUserWon", true);
        }
    }

    useEffect(() => {
        const getUserDidAGuess = localStorage.getItem("AbilityBonusGameUserGuessed") ? JSON.parse(localStorage.getItem("AbilityBonusGameUserGuessed")) : false;
        const getUserBeatGame = localStorage.getItem("AbilityBonusGameUserWon") ? JSON.parse(localStorage.getItem("AbilityBonusGameUserWon")) : false;
        setUserGuessedAbilityName(getUserDidAGuess);
        setUserBeatBonusGame(getUserBeatGame);

        if (getUserDidAGuess && props.allAbilities.length >= 1) {
            const getAbilityNameButton = document.querySelector(".ability-bonus-game-guess");
            getAbilityNameButton.setAttribute("disabled", true);
        }




    }, [userGuessedAbilityName])

    return (
        <section className="popup-rightguess">
            <h1 className="header-popup-rightghuess">YOU GUESSED RIGHT!</h1>
            <img src={props.image} style={props.currentPage === 'Skin' ? { width: "350px", height: "auto" } : {}} alt="" srcset="" />
            <h2 className="header2-popup-rightghuess">{props.name}</h2>
            <p className="paragraph-popup-rightghuess">TRIES: {props.nrTries}</p>

            {props.currentPage === "Ability" && <div className='ability-bonus-game'>
                <h2>BONUS</h2>
                <h2>GUESS THE NAME!</h2>
                {userGuessedAbilityName && < div className='ability-bonus-game-right-wrong-guess' > {userBeatBonusGame ? <p> GG, YOU WON!</p> : <p> Nice try, try again tomorrow! </p>} </div>}
                <div className='all-abilities'>
                    {renderAllAbilities}
                </div>
            </div >}

            {props.nextPage == "None" ? <Link to="/"> <button className="button-popup-rightghuess">Go to Home page</button> </Link> : <Link to={`/${props.nextPage}`}> <button className="button-popup-rightghuess">Guess the {props.nextPage}</button></Link>}
        </section >
    )
}

export default PopupRightGuess