import { useState, useEffect, useRef } from "react";


const Map = () => {
    const [allMaps, setAllMaps] = useState();
    const [isMounted, setIsMounted] = useState(false);
    const [userGuess, setUserGuess] = useState("");
    const [allUserGuesses, setAllUserGuesses] = useState([]);
    const [randomIndexMap, setRandomIndexMap] = useState();
    const date = new Date();
    const [dateState, setDateState] = useState(date);
    const getPreviousTime = localStorage.getItem("mapTaskCreated");
    
    useEffect(() => {

        const getMapIndex = localStorage.getItem("mapIndex");
        const getUserInput = localStorage.getItem("userGuessedMapCorrectly")

            fetch("https://valorant-api.com/v1/maps")
            .then(res => res.json())
            .then(allDataObj => {
                const allMaps = allDataObj.data.map(map => map.displayName)
                setAllMaps(allMaps)
                if(getMapIndex) {
                    setRandomIndexMap(parseInt(getMapIndex))
                    console.log(allMaps)
                    if(getUserInput){
                        const userInputBox = document.getElementById("userMapInput")
                        const submitBtn = document.getElementById("submitBtn")
                        submitBtn.setAttribute("disabled", true)
                        userInputBox.setAttribute("disabled", true)
                    }
                }
                else {
                const randomIndex = Math.floor(Math.random() * allMaps.length)
                localStorage.setItem("mapIndex", randomIndex);
                setRandomIndexMap(randomIndex)
                localStorage.setItem("mapTaskCreated", new Date())
                }
            })
    }, [])

    useEffect((e) => {
        const timeNow = new Date();
        const mapPreviosulyCreated = new Date(getPreviousTime);
        const milisecondsPerHour = 60 * 60 * 1000;
        const hourDifference = (timeNow - mapPreviosulyCreated) / milisecondsPerHour;
        console.log(hourDifference)
        if(hourDifference >= 24){
            localStorage.removeItem("mapIndex")
            localStorage.removeItem("mapTaskCreated")
            localStorage.removeItem("userGuessedMapCorrectly")
        }
    }, [])
    
    
   // Ako izpolzvam isMounted v dependacy array shte vidi che ima promqna i shte runne useEffecta, no nqma da causene re-render. 
   // Zaradi tova izpozlvam state var.


   const handleSubmit = (event) => {
        event.preventDefault();  
        event.target[0].value = "";
        const userGuessTrue = userGuess.toLowerCase() === allMaps[randomIndexMap].toLowerCase();
        if(userGuessTrue){
            localStorage.setItem("userGuessedMapCorrectly", userGuessTrue)
        }
        const userGuessTrueLocalStorage = localStorage.getItem("userGuessedMapCorrectly");
        if(userGuessTrueLocalStorage){
            event.target[0].disabled = true;
            event.target[1].disabled = true;
        }
        console.log(event)
        setAllUserGuesses(prevState => {
            return [...prevState, userGuess]
        })
   }

   const saveUserGuess = (event) => {
        setUserGuess(event.target.value)
   }



   const renderUserGuess = allUserGuesses.map(guess => {return guess.toLowerCase() === allMaps[randomIndexMap].toLowerCase() ? <h1 style={{color:"green"}}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1> 
   : <h1 style={{color:"red"}}> {guess.charAt(0).toUpperCase() + guess.slice(1)} </h1>})
   //Map ima return zashtoto kato otvorq {} zapochva callback funkciq vmesto da dobavq neshta v nov array moga da izpozlvam () i sled tova {} = ({}) vmesto return

   

   
    return (
    
    <div> 
        <form onSubmit={handleSubmit}>
        <input type="text" name="userMapInput" id="userMapInput" onChange={saveUserGuess} />
        {renderUserGuess}
        <button id="submitBtn">Submit</button>
        </form>
    </div>
)
}

export default Map;