import { useState, useEffect, useRef } from "react";
import "./Map.css"
import { Link } from "react-router-dom";

const Map = () => {
    const [allMaps, setAllMaps] = useState();
    const [isMounted, setIsMounted] = useState(false);
    const [userGuess, setUserGuess] = useState("");
    const [allUserGuesses, setAllUserGuesses] = useState([]);
    const [randomIndexMap, setRandomIndexMap] = useState();
    const date = new Date();
    const [dateState, setDateState] = useState(date);
    const getPreviousTime = localStorage.getItem("MapTaskCreated");
    // const [userMadeGuess, setUserMadeGuess] = useState(false);
    const [allUserGuessesLocalStorage, setAllUserGuessesLocalStorage] = useState([])
    const userMadeGuessLocalStorage = JSON.parse(localStorage.getItem("userMadeMapGuess"));
    const userGuessMapCorrectlyLocalStorage = JSON.parse(localStorage.getItem("userGuessedMapCorrectly"))
    const [dayPassed, setDayPassed] = useState(false)
    console.log(allMaps)
    console.log(allUserGuessesLocalStorage)

    const rightGuessStyle = {
        backgroundColor: "#67E574", 
        color: "#FEFEFE",
        width: "300px",
        height: "60px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.3rem"
    }

    const wrongGuessStyle = {
        backgroundColor: "#D2404D",
        color: "#FEFEFE",
        width: "300px",
        height: "60px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.3rem"
    }

    useEffect(() => {
        const getMapIndex = localStorage.getItem("MapIndex");
        const userGuessedCorrectly = localStorage.getItem("userGuessedMapCorrectly")
        const userMapGuessesLocalStorage = JSON.parse(localStorage.getItem("allUserMapGuesses") || null)
        const getUserMapGuesses = JSON.parse(localStorage.getItem("allUserMapGuesses")) ? JSON.parse(localStorage.getItem("allUserMapGuesses")) : [] ;

        console.log(userMapGuessesLocalStorage)
        

            fetch("https://valorant-api.com/v1/maps")
            .then(res => res.json())
            .then(allDataObj => {
                const allMaps = allDataObj.data.map(map => map.displayName)
                setAllMaps(allMaps)
                if(getMapIndex) { 
                    setRandomIndexMap(parseInt(getMapIndex))
                    if(userMadeGuessLocalStorage){
                    setAllUserGuessesLocalStorage(getUserMapGuesses)
                    setAllUserGuesses(getUserMapGuesses)
                    }
                    if(userGuessedCorrectly){
                        const userInputBox = document.getElementById("userMapInput")
                        const submitBtn = document.getElementById("submitBtn")
                        submitBtn.setAttribute("disabled", true)
                        userInputBox.setAttribute("disabled", true)
                    }
                }
                else {
                const randomIndex = Math.floor(Math.random() * allMaps.length)
                localStorage.setItem("MapIndex", randomIndex);
                setRandomIndexMap(randomIndex)
                localStorage.setItem("MapTaskCreated", new Date())
                
                }
            })
           
    }, [])

    // useEffect(() => {
    //     // const timeNow = new Date();
    //     // console.log(timeNow)
    //     // const mapPreviosulyCreated = new Date(getPreviousTime);
    //     // const milisecondsPerHour = 60 * 60 * 1000;
    //     // const hourDifference = (timeNow - mapPreviosulyCreated) / milisecondsPerHour;
    //     // console.log(hourDifference)
    //     // if(hourDifference >= 0.010){
    //     //     localStorage.removeItem("MapIndex")
    //     //     localStorage.removeItem("MapTaskCreated")
    //     //     localStorage.removeItem("userGuessedMapCorrectly")
    //     //     localStorage.removeItem("allUserMapGuesses")
    //     //     localStorage.removeItem("userMadeMapGuess")
    //     //     setDayPassed(true)
    //     // }
    // }, [allMaps])
    
    useEffect(() => {
        setAllUserGuessesLocalStorage(allUserGuesses)  
    }, [allUserGuesses])
    
   // Ako izpolzvam isMounted v dependacy array shte vidi che ima promqna i shte runne useEffecta, no nqma da causene re-render. 
   // Zaradi tova izpozlvam state var.

    console.log(userGuess)
   const handleSubmit = (event) => {

        event.preventDefault();  
        event.target[0].value = "";
        const userGuessTrue = userGuess.toLowerCase() === allMaps[randomIndexMap].toLowerCase();
        
        if(allUserGuesses){
        const userMadeGuess = true;
        localStorage.setItem("userMadeMapGuess", userMadeGuess)
        }
        if(userGuessTrue){
            localStorage.setItem("userGuessedMapCorrectly", userGuessTrue)
        }
        const userGuessTrueLocalStorage = localStorage.getItem("userGuessedMapCorrectly");
        if(userGuessTrueLocalStorage){
            event.target[0].disabled = true;
            event.target[1].disabled = true;
        }
        console.log(allUserGuesses)
        
        
        
        setAllUserGuesses(prevState => {
            localStorage.setItem("allUserMapGuesses", JSON.stringify([...allUserGuesses, userGuess]))
            return [...prevState, userGuess]
        })
    
        setUserGuess("")

        //TODO: Fix it pushes an empty array if the page is reMounted.
        
   }

   const saveUserGuess = (event) => {
        setUserGuess(event.target.value)
   }



   

   const renderUserGuessLocalStorage = allUserGuessesLocalStorage.map(guess => {return guess.toLowerCase() === allMaps[randomIndexMap].toLowerCase() ? <div className="user-guess"><h1 style={rightGuessStyle}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1> </div>
   : <div className="user-guess"> <h1 style={wrongGuessStyle}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1></div>})

   const renderUserGuess = allUserGuesses.map(guess => {return guess.toLowerCase() === allMaps[randomIndexMap].toLowerCase() ? <h1 style={{color:"green"}}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1> 
   : <h1 style={{color:"red"}}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1>})
   //Map ima return zashtoto kato otvorq {} zapochva callback funkciq vmesto da dobavq neshta v nov array moga da izpozlvam () i sled tova {} = ({}) vmesto return

    return (
    
    <div className="map-section"> 
        <form className="map-form" onSubmit={handleSubmit}>
            <div className="input-container">
                 <input type="text" name="userMapInput" id="userMapInput" placeholder="GUESS THE MAP" onChange={saveUserGuess} />
                 <button id="submitBtn"> {">"}</button>
            </div>
        </form>
        {userMadeGuessLocalStorage  ? renderUserGuessLocalStorage : renderUserGuess}
        {userGuessMapCorrectlyLocalStorage && <div className="user-rightguess-popup"> 
        <h2 style={{color: "#D2404D"}}>You Guessed Right! </h2> 
        <h2 style={{color: "#67E574", marginTop: "-0.8em"}}>{allUserGuessesLocalStorage[allUserGuessesLocalStorage.length - 1]}</h2> 
        <h2 style={{color: "#D2404D", marginTop: "-0.8em"}}>Tries: {allUserGuessesLocalStorage.length}</h2> 
        <Link style={{textDecoration: "none"}}to="/Agent" ><div style={{width: "250px", height: "50px", backgroundColor: "#D2404D", textAlign:"center", display:"flex", alignItems:"center", justifyContent:"center", color: "white", border: "1px solid #FEFEFE"}}> Guess the agent </div> </Link>
        </div>}
    </div>
)
}

export default Map;