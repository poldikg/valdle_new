import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navigation.css"

const Navigation = (props) => {

    console.log(props)
    const [dayPassed, setDayPassed] = useState(false);
    const removeTextDecoration = {textDecoration: "none"};
    const removeFromLocalStorage = (name) => {
        const getPreviousTime = localStorage.getItem("MapTaskCreated");
        const timeNow = new Date();
        console.log(timeNow)
        const mapPreviosulyCreated = new Date(getPreviousTime);
        const milisecondsPerHour = 60 * 60 * 1000;
        const hourDifference = (timeNow - mapPreviosulyCreated) / milisecondsPerHour;
        console.log(hourDifference)
        if(hourDifference >= 24){
            localStorage.removeItem(`${name}Index`)
            localStorage.removeItem(`${name}TaskCreated`)
            localStorage.removeItem(`userGuessed${name}Correctly`)
            localStorage.removeItem(`allUser${name}Guesses`)
            localStorage.removeItem(`userMade${name}Guess`)
            setDayPassed(true)
        }
    }
    const navMenu = props.navigationData.map((item, index) => <Link style={removeTextDecoration} to={`/${item.name}`}> <div onClick={() => removeFromLocalStorage(item.name)} key={index} className="nav-item"> 
    <img   className={`nav-img image-${item.name}`} src={`/agent-abilities/${item.img}`} alt=""/> 
    <div  className="text-container"> <h2>{item.name}</h2> <p>{item.description}</p></div> 
    </div> </Link>)

    return(
        <div className="nav-container">
            {/* <li> <Link to="/Map"> Map </Link></li> */}
            {navMenu}
        </div>
    )
}

export default Navigation;