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
        <div className="card petCard mb-4" style={{ borderColor: pet.sex.indexOf('emale') >= 0 ? "pink" :'#2892CF' }}>
            <div className={styles.petCard__imgFrame} style={{ backgroundColor: pet.sex.indexOf('emale') >= 0 ? "pink" : null }}>
                <img src={pet.imgs[0] || "https://via.placeholder.com/250x250"} alt={`${pet.name } | ${pet.sex } | ${pet.breed}`} />
            </div>
            <div className="card-body">
                <div className="card-title h3">{pet.name}</div>
                <div className="card-subtitle mb-2">{pet.sex} | {pet.breed}</div>
                {/* <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p> */}
                <p className="card-text"><small className="text-muted">{pet.domain}</small></p>
                <a className="btn btn-dark" href={pet.petURI} target="_blank">View Profile</a>
            </div>
        </div>
    )

    return template
}
