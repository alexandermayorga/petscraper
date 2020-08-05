import React, {useState, useEffect} from 'react'

import axios from "axios";
import PetCard from './PetCard';

export default function Home() {
    const [pets, setpets] = useState()

    useEffect(() => {
        let cancel;

        axios.get('/api/pets', {
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
        .then(res => {
            setpets(res.data)
        })
        .catch(err => {
            console.log(err)
        })
        //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
        return () => cancel(); 
    }, [])

    const showPets = () => {
        return pets.map(pet => (
            <div key={pet._id} className="col-sm-3">
                <PetCard pet={pet} />
            </div>
        ))
    }

    if (!pets) return "Loading..."

    return (
        <div className="container">
            <div className="row">
                {showPets()}
            </div>
        </div>
    )
}
