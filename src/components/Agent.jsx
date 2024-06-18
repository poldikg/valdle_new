import React from "react";
import "./Agent.css"
import { useState, useEffect } from "react";

const Agent = () => {

    return (<div className="agent-page">
        <div className="agent-upper-section">
            <h2 className="header2-agent-page"> Guess the agent</h2>
            <section className="hint-section">
                <div className="hint">
                    <div className="hint-button">Quote</div>
                    <p>Get a clue in "X" tries.</p>
                </div>
                <div className="hint">
                    <div className="hint-button">Ability </div>
                    <p>Get a clue in "X" tries.</p>
                </div>
            </section>
            <form action="">
                <div className="form-section-input">
                    <input className="agent-input" type="text" placeholder="Type your guess" />
                    <button className="agent-submit-button"> {">"}</button>
                </div>
            </form>
        </div>
    </div>)
}

export default Agent;