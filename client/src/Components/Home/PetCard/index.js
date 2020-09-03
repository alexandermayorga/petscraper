import React, {useState, useEffect} from 'react'

import styles from './style.module.scss'

export default function PetCard({ pet, pageYOffset, pageHeight}) {
    const [cardY, setCardY] = useState()
    // const [cardBottom, setCardBottom] = useState()
    // const [cardHeight, setCardHeight] = useState()

    useEffect(()=>{
        // const card = document.getElementById(`${pet._id}`);
        // const {y,bottom, height} = card.getBoundingClientRect()
        // setCardY(y)
        // setCardBottom(bottom)
        // setCardHeight(height)
    },[])

    const classes = ["animate__animated",styles.not_visible]

    if ((pageYOffset + pageHeight) > (cardY + 260)){
        classes.pop()
        classes.push("animate__fadeInUp")
    }

    const template = (
        <div className="card petCard mb-4">
            <div className={styles.petCard__imgFrame}>
                {pet.imgs[0] ?
                    <img src={pet.imgs[0]} alt={`${pet.name} | ${pet.sex} | ${pet.breed}`} />
                    :
                    <div>No Image Yet 🐶</div>
                }
            </div>
            <div className="card-body">
                <div className="card-title h3">{pet.name}</div>
                <div className="card-subtitle mb-2">
                    <span className="badge"
                        style={{
                            color: pet.sex.indexOf('emale') >= 0 ? "black" : 'white',
                            backgroundColor: pet.sex.indexOf('emale') >= 0 ? "pink" : '#2892CF' }}
                    >{pet.sex}</span>    
                </div>
                <p className="card-text">{pet.breed}</p>
                <p className="card-text"><small className="text-muted">{pet.domain}</small></p>
                <a className="btn btn-dark" href={pet.petURI} target="_blank">View Profile</a>
            </div>
        </div>
    )

    return template
}
