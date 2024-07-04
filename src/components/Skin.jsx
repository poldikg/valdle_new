import React from 'react'
import { useState, useEffect } from 'react'
import "./Skin.css"

const Skin = () => {

    const [allSkins, setAllSkins] = useState([]);
    const [userGuessSkin, setUserGuessSkin] = useState("");
    const [allUserGuessesSkin, setAllUserGuessesSkin] = useState([]);
    const [weaponIndex, setWeaponIndex] = useState();
    const [skinIndex, setSkinIndex] = useState();
    const [skinSuggestions, setSkinSuggestions] = useState([]);
    console.log(userGuessSkin)


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
                }
                else if (getWeaponIndex && getSkinIndex) {
                    setWeaponIndex(parseInt(getWeaponIndex));
                    setSkinIndex(parseInt(getSkinIndex));
                }


            }
            )
    }, [])

    const saveUserSkinGuess = (event) => {
        const upperCaseUserSkinGuess = event.target.value.split(" ").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
        setUserGuessSkin(upperCaseUserSkinGuess);
    }

    const handleSubmitSkin = (event) => {
        event.preventDefault();

        if (userGuessSkin) {
            for (let i = 0; i < skinSuggestions.length; i++) {
                if (!skinSuggestions.includes(userGuessSkin.charAt(0).toUpperCase() + userGuessSkin.slice(1))) {
                    console.log("false")
                    return false;
                }
                else {
                    console.log("true")
                    return true;
                }
            }
        }



    }

    return (
        <div className='skin-page'>
            <div className='skin-section'>
                <h1>Guess the skin</h1>
                <div className='skin-page-image-container'>
                    {allSkins.length > 0 && <img src={allSkins[weaponIndex].weaponSkins[skinIndex].skinURL} alt="Picture of a skin." />}
                </div>
                <form onSubmit={handleSubmitSkin}>
                    <div className='skin-page-inputs'>
                        <input type="text" name="" id="" placeholder='Type a skin guess...' onChange={() => saveUserSkinGuess(event)} />
                        <button> {" > "}</button>
                    </div>
                </form>
                {skinSuggestions}
            </div>
        </div>
    )
}

export default Skin;