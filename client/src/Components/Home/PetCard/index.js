import React from 'react'
import { Link } from "react-router-dom";
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';

export default function PetCard({pet}) {
    return (
        <Card>
            <CardImg top width="100%" src={pet.imgs[0]} alt="Card image cap" />
            <CardBody>
                <CardTitle>{pet.name}</CardTitle>
                <CardSubtitle>{pet.sex} | {pet.breed}</CardSubtitle>
                {/* <CardText>Some quick example text to build on the card title and make up the bulk of the card's content.</CardText> */}
                
                <Button color="main" tag="a" href={pet.petURI} target="_blank">Button</Button>
            </CardBody>
        </Card>
    )
}
