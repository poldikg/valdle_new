import React from 'react'
import "./PopupRightGuess.css"
import { Link } from 'react-router-dom'

const PopupRightGuess = (props) => {
    return (
        <section className="popup-rightguess">
            <h1 className="header-popup-rightghuess">YOU GUESSED RIGHT!</h1>
            <img src={props.image} style={props.currentPage === 'Skin' ? { width: "350px", height: "auto" } : {}} alt="" srcset="" />
            <h2 className="header2-popup-rightghuess">{props.name}</h2>
            <p className="paragraph-popup-rightghuess">TRIES: {props.nrTries}</p>
            <Link to={`/${props.nextPage}`}> <button className="button-popup-rightghuess">Guess the {props.nextPage}</button></Link>
        </section>
    )
}

export default PopupRightGuess