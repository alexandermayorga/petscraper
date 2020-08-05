import React, {useState, useEffect} from 'react'
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';

import styles from './style.module.scss'

export default function PetCard({ pet, pageYOffset, pageHeight}) {
    const [show, setShow] = useState(false)
    const [cardY, setCardY] = useState()
    const [cardBottom, setCardBottom] = useState()
    const [cardHeight, setCardHeight] = useState()

    useEffect(()=>{
        const card = document.getElementById(`${pet._id}`);
        const {y,bottom, height} = card.getBoundingClientRect()
        setCardY(y)
        setCardBottom(bottom)
        setCardHeight(height)
    },[])

    const classes = [styles.not_visible]

    if ((pageYOffset + pageHeight) > (cardY + 260)){
        classes.pop()
        classes.push("animate__animated", "animate__fadeInUp")
    }

    const template = (
        <Card className={classes.join(' ')} id={pet._id}>
            {/* <Card className="animate__animated animate__fadeInUp" id={pet._id}> */}

            <CardImg top width="100%" src={pet.imgs[0]} alt="Card image cap" />
            <CardBody>
                <CardTitle>{pet.name}</CardTitle>
                <CardSubtitle>{pet.sex} | {pet.breed}</CardSubtitle>
                {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText> */}

                <Button color="main" tag="a" href={pet.petURI} target="_blank">Button</Button>
            </CardBody>
        </Card>
    )

    return template
}
