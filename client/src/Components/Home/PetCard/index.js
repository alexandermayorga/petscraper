import React, {useState, useEffect} from 'react'
import {
    Card, CardImg, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';

import styles from './style.module.scss'

export default function PetCard({ pet, pageYOffset, pageHeight}) {
    const [cardY, setCardY] = useState()
    // const [cardBottom, setCardBottom] = useState()
    // const [cardHeight, setCardHeight] = useState()

    useEffect(()=>{
        const card = document.getElementById(`${pet._id}`);
        const {y,bottom, height} = card.getBoundingClientRect()
        setCardY(y)
        // setCardBottom(bottom)
        // setCardHeight(height)
    },[])

    const classes = ["animate__animated",styles.not_visible]

    if ((pageYOffset + pageHeight) > (cardY + 260)){
        classes.pop()
        classes.push("animate__fadeInUp")
    }

    const template = (
        <Card className={classes.join(' ')} id={pet._id}>
            {/* <Card className="animate__animated animate__fadeInUp" id={pet._id}> */}

            <CardImg top width="100%" src={pet.imgs[0] || "https://via.placeholder.com/250x250"} alt="Card image cap" />
            <CardBody>
                <CardTitle>{pet.name}</CardTitle>
                <CardSubtitle>{pet.sex} | {pet.breed}</CardSubtitle>
                {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText> */}

                <Button className="mt-3" color="main" tag="a" href={pet.petURI} target="_blank">View Profile</Button>
            </CardBody>
        </Card>
    )

    return template
}
