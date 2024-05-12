import React from "react";
import { Link } from "react-router-dom";
import "./Navigation.css"

const Navigation = (props) => {
    console.log(props)
    const removeTextDecoration = {textDecoration: "none"};
    
    const navMenu = props.navigationData.map(item => <Link style={removeTextDecoration} to={`/${item.name}`}> <div className="nav-item"> 
    <img className="nav-img" src={`/agent-abilities/${item.img}`} alt=""/> 
    <div className="text-container"> <h2>{item.name}</h2> <p>{item.description}</p></div> 
    </div> </Link>)

    return(
        <div className="nav-container">
            {/* <li> <Link to="/Map"> Map </Link></li> */}
            {navMenu}
        </div>
    )
}

export default Navigation;