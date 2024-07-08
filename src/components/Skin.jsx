import React from 'react'
import { useState, useEffect } from 'react'
import PopupRightGuess from './PopupRightGuess'
import "./Skin.css"


const Skin = () => {

    const [allSkins, setAllSkins] = useState([]);
    const [userGuessSkin, setUserGuessSkin] = useState("");
    const [allUserGuessesSkin, setAllUserGuessesSkin] = useState([]);
    const [weaponIndex, setWeaponIndex] = useState();
    const [skinIndex, setSkinIndex] = useState();
    const [skinSuggestions, setSkinSuggestions] = useState([]);
    const [userMadeRightGuess, setUserMadeRightGuess] = useState(false);
    // console.log(allSkins[weaponIndex].weaponSkins[skinIndex].skinName)
    // console.log(userGuessSkin === allSkins[weaponIndex].weaponSkins[skinIndex].skinName)

    const styleWrongGuess = {
        backgroundColor: "#D2404D",
        padding: "3em",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }

    const styleRightGuess = {
        backgroundColor: "#16AC25",
        padding: "3em",
        borderRadius: "4px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    }


    useEffect(() => {



        if (userGuessSkin.length >= 1) {
            const testArr = [];
            for (let i = 0; i < allSkins.length; i++) {
                if (allSkins[i].weaponName.includes(userGuessSkin.charAt(0).toUpperCase() + userGuessSkin.slice(1))) {
                    for (let n = 0; n < allSkins[i].weaponSkins.length; n++) {
                        testArr.push(allSkins[i].weaponSkins[n].skinName)
                    }
                }
                else if (!allSkins[i].weaponName.includes(userGuessSkin.charAt(0).toUpperCase() + userGuessSkin.slice(1))) {
                    for (let j = 0; j < allSkins[i].weaponSkins.length; j++) {
                        if (allSkins[i].weaponSkins[j].skinName.includes(userGuessSkin.charAt(0).toUpperCase() + userGuessSkin.slice(1))) {
                            testArr.push(allSkins[i].weaponSkins[j].skinName)
                        }
                    }
                }
            }
            setSkinSuggestions(testArr)
        }
        else if (userGuessSkin === "") {
            setSkinSuggestions([])
        }

    }, [userGuessSkin])

    useEffect(() => {
        const getWeaponIndex = localStorage.getItem("SkinWeaponIndex") ? localStorage.getItem("SkinWeaponIndex") : undefined;
        const getSkinIndex = localStorage.getItem("SkinSkinIndex") ? localStorage.getItem("SkinSkinIndex") : undefined;
        const getAllUserGuessesSkin = localStorage.getItem("allUserSkinGuesses") ? JSON.parse(localStorage.getItem("allUserSkinGuesses")) : [];
        const userGuessedCorrectly = localStorage.getItem("userGuessedSkinCorrectly") ? JSON.parse(localStorage.getItem("userGuessedSkinCorrectly")) : false;
        console.log(userGuessedCorrectly)

        fetch("https://valorant-api.com/v1/weapons")
            .then(res => res.json())
            .then(data => {
                const sortedSkins = data.data.map(weapon => {
                    return {
                        weaponName: weapon.displayName,
                        weaponSkins: weapon.skins.map(info => {
                            return {
                                skinName: info.displayName,
                                skinURL: info.displayIcon
                            }
                        })
                    }
                })
                setAllSkins(sortedSkins);

                if (getWeaponIndex === undefined && getSkinIndex === undefined) {
                    const randomWeaponIndex = Math.floor(Math.random() * sortedSkins.length);
                    setWeaponIndex(randomWeaponIndex);
                    localStorage.setItem("SkinWeaponIndex", randomWeaponIndex);

                    const randomSkinIndex = Math.floor(Math.random() * sortedSkins[randomWeaponIndex].weaponSkins.length)
                    setSkinIndex(randomSkinIndex);
                    localStorage.setItem("SkinSkinIndex", randomSkinIndex);

                    const skinTaskCreated = new Date();
                    localStorage.setItem("SkinTaskCreated", skinTaskCreated)
                }
                else if (getWeaponIndex && getSkinIndex) {
                    if (userGuessedCorrectly) {
                        const getTextInput = document.querySelector("#skin-input-text");
                        const getButtonInput = document.querySelector("#skin-input-button");

                        getTextInput.setAttribute("placeholder", "TRY AGAIN TOMORROW");
                        getTextInput.setAttribute("disabled", true);
                        getButtonInput.setAttribute("disabled", true);
                        setUserMadeRightGuess(userGuessedCorrectly);
                    }
                    setWeaponIndex(parseInt(getWeaponIndex));
                    setSkinIndex(parseInt(getSkinIndex));
                    setAllUserGuessesSkin(getAllUserGuessesSkin);


                }


            }
            )
    }, [])

    const saveUserSkinGuess = (event) => {
        const upperCaseUserSkinGuess = event.target.value.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        setUserGuessSkin(upperCaseUserSkinGuess);
    }

    const handleSubmitSkin = (event) => {
        console.log(event)
        event.preventDefault();
        event.target[0].value = "";


        const allSkinNames = allSkins.map(weapon => weapon.weaponSkins)
        if (userGuessSkin === allSkins[weaponIndex].weaponSkins[skinIndex].skinName) {
            event.target[0].disabled = true;
            event.target[1].disabled = true;
            event.target[0].placeholder = "TRY AGAIN TOMORROW";
            localStorage.setItem("userGuessedSkinCorrectly", true);
            setUserMadeRightGuess(true);
        }

        setUserGuessSkin("");

        if (userGuessSkin) {
            for (let i = 0; i < skinSuggestions.length; i++) {
                if (!skinSuggestions.includes(userGuessSkin.charAt(0).toUpperCase() + userGuessSkin.slice(1))) {
                    console.log("false")
                    return false;
                }
            }
        }

        if (userGuessSkin) {
            const checkExistingGuesses = allUserGuessesSkin.filter(guess => guess.skinName === userGuessSkin);
            if (checkExistingGuesses.length >= 1) {
                return false;
            }
        }

        if (userGuessSkin) {
            for (let i = 0; i < allSkinNames.length; i++) {
                for (let j = 0; j < allSkinNames[i].length; j++) {
                    if (allSkinNames[i][j].skinName.includes(userGuessSkin)) {
                        setAllUserGuessesSkin(prevState => {
                            return [allSkinNames[i][j], ...prevState]
                        })

                        localStorage.setItem("allUserSkinGuesses", JSON.stringify([allSkinNames[i][j], ...allUserGuessesSkin]))
                    }
                }
            }
        }
    }

    const sendSkinSuggestion = (skinName) => {
        setUserGuessSkin(skinName)
    }

    useEffect(() => {
        const getRightGuessPopup = document.querySelector(".popup-rightguess");
        getRightGuessPopup ? getRightGuessPopup.scrollIntoView() : "";

    }, [userMadeRightGuess])

    const renderUserSkinGuesses = allUserGuessesSkin.map(guess => {
        return guess.skinName === allSkins[weaponIndex].weaponSkins[skinIndex].skinName ? <div style={styleRightGuess} className='skin-user-guess'>
            <img src={guess.skinURL} alt="" />
            <p> {guess.skinName}</p>
        </div> :
            <div style={styleWrongGuess} className='skin-user-guess'>
                <img src={guess.skinURL} alt="" />
                <p> {guess.skinName}</p>
            </div>
    })

    const renderSkinSuggestions = skinSuggestions.map(suggestion => <button className='button-send-skin-suggestion' onClick={() => sendSkinSuggestion(suggestion)}> {suggestion} </button>)

    return (
        <div className='skin-page'>
            <div className='skin-section'>
                <h1>Guess the skin</h1>
                <div className='skin-page-image-container'>
                    {allSkins.length > 0 && <img src={allSkins[weaponIndex].weaponSkins[skinIndex].skinURL} alt="Picture of a skin." />}
                </div>
                <form onSubmit={handleSubmitSkin}>
                    <div className='skin-page-inputs'>
                        <input id="skin-input-text" type="text" name="" placeholder='Type your guess' onChange={() => saveUserSkinGuess(event)} autoComplete='off' />
                        <button id='skin-input-button'> {" > "}</button>
                    </div>
                    {skinSuggestions.length >= 1 && <section className='skin-suggestions'>
                        {renderSkinSuggestions}
                    </section>}
                </form>
            </div>

            <section className='skin-user-guesses'>
                {renderUserSkinGuesses}
            </section>

            {userMadeRightGuess && <PopupRightGuess
                image={allSkins[weaponIndex].weaponSkins[skinIndex].skinURL}
                name={allSkins[weaponIndex].weaponSkins[skinIndex].skinName}
                nrTries={allUserGuessesSkin.length}
                currentPage={"Skin"}
                nextPage={"Ability"}
            />}
        </div>
    )
}

export default Skin;