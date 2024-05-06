import { useState, useEffect, useRef } from "react";


const Map = () => {
    const [allMaps, setAllMaps] = useState();
    const [isMounted, setIsMounted] = useState(false);
    const [userGuess, setUserGuess] = useState("");
    const [allUserGuesses, setAllUserGuesses] = useState([]);
    const [randomIndexMap, setRandomIndexMap] = useState();
    const date = new Date();
    const [dateState, setDateState] = useState(date);
    
    console.log(randomIndexMap, allMaps, isMounted)

    

    const testVar = testFunction();
    console.log(testVar)

    useEffect(() => {
            const getRandomIndex = localStorage.getItem("mapIndex")

            fetch("https://valorant-api.com/v1/maps")
            .then(res => res.json())
            .then(allDataObj => {
                const allMaps = allDataObj.data.map(map => map.displayName)
                setAllMaps(allMaps)
                if(getRandomIndex) {
                    setRandomIndexMap(parseInt(getRandomIndex))
                }
                else {
                const randomIndex = Math.floor(Math.random() * allMaps.length)
                localStorage.setItem("mapIndex", randomIndex);
                setRandomIndexMap(randomIndex)
                }
            })
    }, [])


    

   // Ako izpolzvam isMounted v dependacy array shte vidi che ima promqna i shte runne useEffecta, no nqma da causene re-render. 
   // Zaradi tova izpozlvam state var.


   const handleSubmit = (event) => {
        event.preventDefault();  
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
        <input type="text" name="" id="" onChange={saveUserGuess} />
        {renderUserGuess}
        <button>Submit</button>
        </form>
    </div>
)
}

export default Map;