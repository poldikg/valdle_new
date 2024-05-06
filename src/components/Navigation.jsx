import React from "react";
import { Link } from "react-router-dom";

const Navigation = () => {
        
    const CSS = {listStyle: "none"}

    return(
        <ul style={CSS}>
            <li> <Link to="/Map"> Map </Link></li>
        </ul>
    )
}

export default Navigation;