import React, {useState, useEffect} from 'react'

import axios from "axios";
import PetCard from './PetCard';
import FilterBar from './FilterBar';

export default function Home() {
    const [pets, setpets] = useState()
    const [sex, setSex] = useState('all')
    const [pageYOffset, setPageYOffset] = useState(0)
    const [pageInnerHeight, setPageInnerHeight] = useState()

    useEffect(() => {
        let cancel;
        let fetchURI = '/api/pets';

        if (sex !== 'all') fetchURI = `${fetchURI}/sex/${sex}`

        axios.get(fetchURI, {
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
    }, [sex])

    useEffect(() => {
        setPageInnerHeight(window.innerHeight)
        window.addEventListener('scroll', e => setPageYOffset(window.pageYOffset))
        return () => window.removeEventListener('scroll', () => false); 
    }, [])


    const showPets = () => {
        return pets.map(pet => (
            <div key={pet._id} className="col-md-6 col-lg-4 col-xl-3">
                <PetCard pet={pet} pageYOffset={pageYOffset} pageHeight={pageInnerHeight}/>
            </div>
        ))
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <FilterBar filterSex={setSex}/>
                </div>
            </div>

            <div className="row">
                {!pets && "Loading..."}
                {pets && showPets()}
            </div>
        </div>
    )

}
