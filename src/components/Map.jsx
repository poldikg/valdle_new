import { useState, useEffect, useRef } from "react";
import "./Map.css"
import mapData from "./MapData";
import PopupRightGuess from "./PopupRightGuess";
import { motion } from "framer-motion";
import { Link, json } from "react-router-dom";

const Map = () => {
    const [allMaps, setAllMaps] = useState([]);
    const [copyAllMaps, setCopyAllMaps] = useState([]);
    const [userGuess, setUserGuess] = useState(undefined);
    const [allUserGuesses, setAllUserGuesses] = useState([]);
    const [randomIndexMap, setRandomIndexMap] = useState();
    const [mapLocationIndex, setMapLocationIndex] = useState();
    const [allUserGuessesLocalStorage, setAllUserGuessesLocalStorage] = useState([]);
    const userMadeGuessLocalStorage = JSON.parse(localStorage.getItem("userMadeMapGuess"));
    const userGuessMapCorrectlyLocalStorage = JSON.parse(localStorage.getItem("userGuessedMapCorrectly"));
    const [userGuessedMapCorrectly, setUserGussedMapCorrectly] = useState(false);
    const [mapsSuggestions, setMapsSuggestions] = useState([]);
    const [mapSuggestionHappened, setMapSuggestionHappend] = useState(false);
    const suggestionRef = useRef();
    console.log(copyAllMaps)

    const hideRightGuessPopupStyle = {
        opacity: "0",
        zIndex: "-10"
    }

    const showRightGuessPopupStyle = {
        opacity: "1",
        zIndex: "1"
    }

    const rightGuessStyle = {
        backgroundColor: "#16AC25",
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
    const renderMapSuggestions = mapsSuggestions.map(map => <button className="button-map-name" useRef={suggestionRef} onClick={() => {
        sendMapNameToUserInput(map)
    }}> {map} </button>)

    useEffect(() => {


        if (userGuess !== undefined) {
            for (let i = 0; i < copyAllMaps.length; i++) {
                if (userGuess.charAt(0) === copyAllMaps[i][0]) {
                    const finalSuggestions = copyAllMaps.filter(map => map.slice(0, userGuess.length) === userGuess);
                    setMapsSuggestions(finalSuggestions);
                    setMapSuggestionHappend(true);
                }
            }
            if (userGuess === "") {
                setMapSuggestionHappend(false);
                setMapsSuggestions([]);
            }
        }
        else if (userGuess === undefined) {
            setMapSuggestionHappend(false);
            setMapsSuggestions([]);
        }



    }, [userGuess])

    useEffect(() => {
        const getMapIndex = localStorage.getItem("MapIndex") ? localStorage.getItem("MapIndex") : undefined;
        const getMapLocationIndex = localStorage.getItem("MapLocationIndex") ? localStorage.getItem("MapLocationIndex") : undefined;
        const userGuessedCorrectly = localStorage.getItem("userGuessedMapCorrectly");
        const userMapGuessesLocalStorage = JSON.parse(localStorage.getItem("allUserMapGuesses") || null);
        const getUserMapGuesses = JSON.parse(localStorage.getItem("allUserMapGuesses")) ? JSON.parse(localStorage.getItem("allUserMapGuesses")) : [];
        const mapSuggestionsLocalStorage = localStorage.getItem("MapSuggestions") ? JSON.parse(localStorage.getItem("MapSuggestions")) : [];
        console.log(mapSuggestionsLocalStorage)


        setAllMaps(mapData);
        const onlyMapNames = mapData.map(map => map.mapName);
        setCopyAllMaps(onlyMapNames);

        if (getMapIndex) {
            setRandomIndexMap(parseInt(getMapIndex))
            setMapLocationIndex(parseInt(getMapLocationIndex));

            if (userMadeGuessLocalStorage) {
                setCopyAllMaps(mapSuggestionsLocalStorage)
                setAllUserGuessesLocalStorage(getUserMapGuesses)
                setAllUserGuesses(getUserMapGuesses)

            }
            if (userGuessedCorrectly) {
                setUserGussedMapCorrectly(JSON.parse(userGuessedCorrectly))
                console.log("yo")
                const userInputBox = document.querySelector(".userMapInput")
                const submitBtn = document.getElementById("submitBtn")
                submitBtn.setAttribute("disabled", true)
                userInputBox.setAttribute("disabled", true)
            }
        }
        else {
            const randomIndex = Math.floor(Math.random() * mapData.length)
            console.log(allMaps.length);
            const randomMapLocationIndex = Math.floor(Math.random() * mapData[randomIndex].locations.length);
            localStorage.setItem("MapLocationIndex", randomMapLocationIndex)
            localStorage.setItem("MapIndex", randomIndex);
            setMapLocationIndex(randomMapLocationIndex);
            setRandomIndexMap(randomIndex)
            localStorage.setItem("MapTaskCreated", new Date())

        }

        console.log("mounted map")
    }, [])

    useEffect(() => {
        setAllUserGuessesLocalStorage(allUserGuesses)
    }, [allUserGuesses])

    //Disabling space
    const detectSpace = (event) => {
        if (event.keyCode === 32) {
            event.preventDefault();
        }
    }

    // Ako izpolzvam isMounted v dependacy array shte vidi che ima promqna i shte runne useEffecta, no nqma da causene re-render. 
    // Zaradi tova izpozlvam state var.

    const handleSubmit = (event) => {


        console.log(event)
        event.preventDefault();
        event.target[0].value = "";

        const mapNames = allMaps.map(map => map.mapName);

        if (!mapNames.includes(userGuess)) {
            setUserGuess(undefined);
            return false;
        }
        for (let guess in allUserGuesses) {
            if (allUserGuesses[guess].toLowerCase().includes(userGuess.toLowerCase())) {
                alert("Try something else. You already guessed this map.");
                setUserGuess(undefined);
                return false;
            }
        }
        if (userGuess === "") {
            event.target[0].required = true;
        }
        const userGuessTrue = userGuess.toLowerCase() === allMaps[randomIndexMap].mapName.toLowerCase();

        if (allUserGuesses) {
            const userMadeGuess = true;
            localStorage.setItem("userMadeMapGuess", userMadeGuess)
        }
        if (userGuessTrue) {
            localStorage.setItem("userGuessedMapCorrectly", userGuessTrue)
            setUserGussedMapCorrectly(userGuessTrue);
            setUserGuess(undefined);
        }
        const userGuessTrueLocalStorage = localStorage.getItem("userGuessedMapCorrectly");
        if (userGuessTrueLocalStorage) {
            event.target[0].disabled = true;
            event.target[1].disabled = true;
        }

        if (mapNames.includes(userGuess))
            setAllUserGuesses(prevState => {
                localStorage.setItem("allUserMapGuesses", JSON.stringify([userGuess, ...allUserGuesses]))
                return [userGuess, ...prevState];
            })

        for (let i = 0; i <= copyAllMaps.length; i++) { //FIX
            if ((userGuess === copyAllMaps[i]) && !userGuessTrue) {
                const indexMap = copyAllMaps.indexOf(copyAllMaps[i]);
                let filteredMaps = copyAllMaps.splice(indexMap, 1);
                localStorage.setItem("MapSuggestions", JSON.stringify([...copyAllMaps]));
                setUserGuess(undefined);
            }
        }

        setUserGuess(undefined)
    }

    const saveUserGuess = (event) => {
        const userGuessUpperCased = event.target.value.charAt(0).toUpperCase() + event.target.value.slice(1)
        setUserGuess(userGuessUpperCased)
    }

    useEffect(() => {
        const boxRightGuess = document.querySelector(".popup-rightguess") ? document.querySelector(".popup-rightguess").scrollIntoView(true) : undefined
    }, [userGuessedMapCorrectly])


    const renderUserGuessLocalStorage = allUserGuessesLocalStorage.map(guess => {
        return guess === allMaps[randomIndexMap].mapName ? <motion.div key={guess}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: userGuessedMapCorrectly ? 0 : 0.7,
                delay: userGuessedMapCorrectly ? 0 : 0.5,
                ease: [0, 0.71, 0.2, 1.01]
            }} className="user-guess"><h1 style={rightGuessStyle}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1> </motion.div>
            : <motion.div key={guess}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                    duration: userGuessedMapCorrectly ? 0 : 0.7,
                    delay: userGuessedMapCorrectly ? 0 : 0.5,
                    ease: [0, 0.71, 0.2, 1.01]
                }} className="user-guess"> <h1 style={wrongGuessStyle}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1></motion.div >
    })

    const renderUserGuess = allUserGuesses.map(guess => {
        return guess === allMaps[randomIndexMap].mapName ? <h1 style={{ color: "green" }}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1>
            : <h1 style={{ color: "red" }}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1>
    })
    //Map ima return zashtoto kato otvorq {} zapochva callback funkciq vmesto da dobavq neshta v nov array moga da izpozlvam () i sled tova {} = ({}) vmesto return

    return (

        <div className="map-section">
            <form className="map-form" onSubmit={handleSubmit}>
                <section className="guess-section">
                    <h2> GUESS THE MAP </h2>
                    <div className="image-holder">
                        {allMaps.length >= 1 && <img src={allMaps[randomIndexMap].locations[mapLocationIndex]} alt="" draggable="false" style={{ zoom: "50%" }} />}
                    </div>
                    <div className="map-input">
                        <div className="input-container" style={userGuessedMapCorrectly ? { display: "none" } : { display: "flex" }}>
                            <input type="text" name="userMapInput" className="userMapInput" placeholder="Type your guess" autoComplete="off" onChange={saveUserGuess} onKeyDown={detectSpace}
                            />
                            <button id="submitBtn"> {">"}</button>
                        </div>
                        {mapsSuggestions.length >= 1 && <div className="map-suggestions-container">
                            {renderMapSuggestions}
                        </div>}
                    </div>
                </section>

                <div className="map-form-lower">
                    {userMadeGuessLocalStorage ? renderUserGuessLocalStorage : renderUserGuess}
                    {userGuessedMapCorrectly && <PopupRightGuess
                        image={allMaps[randomIndexMap].locations[mapLocationIndex]}
                        name={allMaps[randomIndexMap].mapName}
                        nrTries={allUserGuesses.length}
                        rightAbility=""
                        allAbilities={[]}
                        currentPage={"Map"}
                        nextPage={"Agent"}
                    />}
                </div>

            </form>

        </div>
    )
}

export default Map;