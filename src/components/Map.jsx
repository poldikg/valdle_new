import { useState, useEffect, useRef } from "react";
import "./Map.css"
import { Link, json } from "react-router-dom";

const Map = () => {
    const [allMaps, setAllMaps] = useState([]);
    const [copyAllMaps, setCopyAllMaps] = useState([]);
    const [isMounted, setIsMounted] = useState(false);
    const [userGuess, setUserGuess] = useState(undefined);
    const [allUserGuesses, setAllUserGuesses] = useState([]);
    const [randomIndexMap, setRandomIndexMap] = useState();
    const date = new Date();
    const [dateState, setDateState] = useState(date);
    const getPreviousTime = localStorage.getItem("MapTaskCreated");
    // const [userMadeGuess, setUserMadeGuess] = useState(false);
    const [allUserGuessesLocalStorage, setAllUserGuessesLocalStorage] = useState([]);
    const userMadeGuessLocalStorage = JSON.parse(localStorage.getItem("userMadeMapGuess"));
    const userGuessMapCorrectlyLocalStorage = JSON.parse(localStorage.getItem("userGuessedMapCorrectly"));
    const [userGuessedMapCorrectly, setUserGussedMapCorrectly] = useState(false);
    const [dayPassed, setDayPassed] = useState(false);
    const [mapsSuggestions, setMapsSuggestions] = useState([]);
    const [mapSuggestionHappened, setMapSuggestionHappend] = useState(false);
    console.log(copyAllMaps)
    console.log(allMaps)

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
    };

    const wrongGuessStyle = {
        backgroundColor: "#D2404D",
        color: "#FEFEFE",
        width: "300px",
        height: "60px",
        borderRadius: "8px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "1.3rem",
        
    };

    const sendMapNameToUserInput = (mapName) => {
        setUserGuess(mapName);
    }
    const renderMapSuggestions = mapsSuggestions.map(map => <button className="button-map-name" onClick={() => { 
        sendMapNameToUserInput(map)}}> {map} </button>)
    
    useEffect(() => {
        setMapsSuggestions([]);
        
        if (userGuess !== undefined) {
            for (let i = 0; i < copyAllMaps.length; i++) {  
                if (userGuess.charAt(0).toUpperCase() === copyAllMaps[i][0]) {
                    const finalSuggestions = copyAllMaps.filter(map => map.slice(0, userGuess.length).toLowerCase() === userGuess.toLowerCase());
                    setMapsSuggestions(finalSuggestions);
                    setMapSuggestionHappend(true);
                }
            }
            if (userGuess === ""){
                setMapSuggestionHappend(false);
            }
        }
        else if (userGuess === undefined) {
            setMapSuggestionHappend(false);
        }

      
        
    }, [userGuess])

    useEffect(() => {
        const getMapIndex = localStorage.getItem("MapIndex");
        const userGuessedCorrectly = localStorage.getItem("userGuessedMapCorrectly");
        const userMapGuessesLocalStorage = JSON.parse(localStorage.getItem("allUserMapGuesses") || null);
        const getUserMapGuesses = JSON.parse(localStorage.getItem("allUserMapGuesses")) ? JSON.parse(localStorage.getItem("allUserMapGuesses")) : [];
        const mapSuggestionsLocalStorage = JSON.parse(localStorage.getItem("mapSuggestions"));
        console.log(userMapGuessesLocalStorage)


        fetch("https://valorant-api.com/v1/maps")
            .then(res => res.json())
            .then(allDataObj => {
                const allMaps = allDataObj.data.map(map => map.displayName);
                setAllMaps(allMaps);
                setCopyAllMaps([...allMaps]);
                
                if (getMapIndex) {
                    setRandomIndexMap(parseInt(getMapIndex))
                    if (userMadeGuessLocalStorage) {
                        setCopyAllMaps(mapSuggestionsLocalStorage)
                        setAllUserGuessesLocalStorage(getUserMapGuesses)
                        setAllUserGuesses(getUserMapGuesses)

                    }
                    if (userGuessedCorrectly) {
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
            console.log("mounted")
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

    const detectSpace = (event) => {
        if(event.keyCode === 32) {
            event.preventDefault();
        }
    }

    // Ako izpolzvam isMounted v dependacy array shte vidi che ima promqna i shte runne useEffecta, no nqma da causene re-render. 
    // Zaradi tova izpozlvam state var.

    const handleSubmit = (event) => {

        console.log(event)
        event.preventDefault();
        event.target[0].value = "";
        for(let guess in allUserGuesses){
            if(allUserGuesses[guess].toLowerCase().includes(userGuess.toLowerCase())){
                alert("Try something else. You already guessed this map.");
                setUserGuess(undefined);
                return false;
            }
        }
        if(userGuess === ""){
            event.target[0].required = true;
        }
        const userGuessTrue = userGuess.toLowerCase() === allMaps[randomIndexMap].toLowerCase();

        if (allUserGuesses) {
            const userMadeGuess = true;
            localStorage.setItem("userMadeMapGuess", userMadeGuess)
        }
        if (userGuessTrue) {
            localStorage.setItem("userGuessedMapCorrectly", userGuessTrue)
            setUserGussedMapCorrectly(userGuessTrue)
        }
        const userGuessTrueLocalStorage = localStorage.getItem("userGuessedMapCorrectly");
        if (userGuessTrueLocalStorage) {
            event.target[0].disabled = true;
            event.target[1].disabled = true;
        }

        setAllUserGuesses(prevState => {
            localStorage.setItem("allUserMapGuesses", JSON.stringify([...allUserGuesses, userGuess]))
            return [...prevState, userGuess]
        })

        for(let i = 0; i <= copyAllMaps.length; i++){
            if(userGuess.toLowerCase() === copyAllMaps[i].toLowerCase() && !userGuessTrue){
                const indexMap = copyAllMaps.indexOf(copyAllMaps[i]);
                let filteredMaps = copyAllMaps.splice(indexMap, 1);
                localStorage.setItem("mapSuggestions", JSON.stringify([...copyAllMaps]));
                setUserGuess(undefined);
            }
        }

        setUserGuess(undefined)
    }

    const saveUserGuess = (event) => {
        console.log(event)
        setUserGuess(event.target.value)
    }

    useEffect(() => {
        const boxRightGuess = document.querySelector(".user-rightguess-popup") ? document.querySelector(".user-rightguess-popup").scrollIntoView(true) : undefined
    }, [userGuessedMapCorrectly])





    const renderUserGuessLocalStorage = allUserGuessesLocalStorage.map(guess => {
        return guess.toLowerCase() === allMaps[randomIndexMap].toLowerCase() ? <div className="user-guess"><h1 style={rightGuessStyle}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1> </div>
            : <div className="user-guess"> <h1 style={wrongGuessStyle}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1></div>
    })

    const renderUserGuess = allUserGuesses.map(guess => {
        return guess.toLowerCase() === allMaps[randomIndexMap].toLowerCase() ? <h1 style={{ color: "green" }}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1>
             : <h1 style={{ color: "red"}}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1>
    })
    //Map ima return zashtoto kato otvorq {} zapochva callback funkciq vmesto da dobavq neshta v nov array moga da izpozlvam () i sled tova {} = ({}) vmesto return

    return (

        <div className="map-section">
            <form className="map-form" onSubmit={handleSubmit}>
                <div className="input-container">
                    <input type="text" name="userMapInput" id="userMapInput" placeholder="GUESS THE MAP" autoComplete="off" onChange={saveUserGuess} onKeyDown={detectSpace} aria-autocomplete="list"
                    />         
                     
                    <button id="submitBtn"> {">"}</button>
                    
                </div>
                
                {mapsSuggestions.length >= 1 && <div className="map-suggestions-container">
                {renderMapSuggestions}
                </div> }
                
                <div className="map-form-lower">
                    {userMadeGuessLocalStorage ? renderUserGuessLocalStorage : renderUserGuess}
                    {userGuessMapCorrectlyLocalStorage && <div className="user-rightguess-popup">
                        <h2 style={{ color: "#D2404D" }}>You Guessed Right! </h2>
                        <h2 style={{ color: "#67E574", marginTop: "-0.8em" }}>{allUserGuessesLocalStorage[allUserGuessesLocalStorage.length - 1]}</h2>
                        <h2 style={{ color: "#D2404D", marginTop: "-0.8em" }}>Tries: {allUserGuessesLocalStorage.length}</h2>
                        <Link style={{ textDecoration: "none" }} to="/Agent" ><div style={{ width: "250px", height: "50px", backgroundColor: "#D2404D", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", color: "white", border: "1px solid #FEFEFE" }}> Guess the agent </div> </Link>
                    </div>}
                </div>

            </form>

        </div>
    )
}

export default Map;