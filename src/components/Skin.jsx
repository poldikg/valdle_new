import React from 'react'
import { useState, useEffect } from 'react'
import "./Skin.css"

const Skin = () => {

    const [allSkins, setAllSkins] = useState([]);
    const [userGuessSkin, setUserGuessSkin] = useState("");
    const [allUserGuessesSkin, setAllUserGuessesSkin] = useState([]);

    console.log(allSkins)
    useEffect(() => {
        fetch("https://valorant-api.com/v1/weapons")
            .then(res => res.json())
            .then(data => {
                const sortedSkins = data.data.map(skin => {
                    return {
                        weaponName: skin.displayName,
                        weaponSkins: skin.skins.map(info => {
                            return {
                                skinName: info.displayName,
                                skinURL: info.displayIcon
                            }
                        })
                    }
                })
                setAllSkins(sortedSkins)
            }
            )
    }, [])

    return (
        <div className='skin-page'>
            <div className='skin-section'>
                <h1>Guess the skin</h1>
                <div className='skin-page-image-container'>
                    {allSkins.length > 0 && <img src={allSkins[2].weaponSkins[1].skinURL} alt="" srcset="" />}
                </div>
                <form action="">
                    <div className='skin-page-inputs'>
                        <input type="text" name="" id="" placeholder='Type a skin guess...' />
                        <button> {" > "}</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Skin;