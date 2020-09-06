import React, {useState, useEffect} from 'react'

import axios from "axios";
import PetCard from './PetCard';
import FilterBar from './FilterBar';
import Pagination from './Pagination';

export default function Home() {
    const [fetchURI, setFetchURI] = useState('/api/animals?')
    const [pets, setPets] = useState()
    const [total, setTotal] = useState(0)
    const [sex, setSex] = useState('all')
    const [pages, setPages] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [queryText, setQueryText] = useState('')

    useEffect(() => {
        let cancel;
        axios.get(fetchURI, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                setPets(res.data.results)
                setPages(res.data.pages)
                setTotal(res.data.total)
            })
            .catch(err => {
                console.log(err)
            })
        //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
        return () => cancel();
    }, [])

    const searchBySex = (sex) => {
        let cancel;
        let newFetchURI = `/api/animals${sex !== "all" ? `/sex/${sex}?` : '?'}`;

        axios.get(newFetchURI, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                setQueryText('')
                setFetchURI(newFetchURI)
                setCurrentPage(1)
                setPets(res.data.results)
                setPages(res.data.pages)
                setSex(sex)
                setTotal(res.data.total)
            })
            .catch(err => {
                console.log(err)
            })
        //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
        return () => cancel(); 
    }

    const searchByBreed = (queryText) => {
        let cancel;
        let newFetchURI = `/api/search?breed=${queryText}&`;

        axios.get(newFetchURI, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                setFetchURI(newFetchURI)
                setCurrentPage(1)
                setPets(res.data.results)
                setPages(res.data.pages)
                setSex('all')
                setTotal(res.data.total)
            })
            .catch(err => {
                console.log(err)
            })
        //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
        return () => cancel(); 
    }

    const changePage = (pageNum) => {
        let cancel;
        let newFetchURI = fetchURI;

        newFetchURI+= `offset=${20*(pageNum-1)}`

        axios.get(newFetchURI, {
            cancelToken: new axios.CancelToken(c => cancel = c)
        })
            .then(res => {
                setPets(res.data.results)
                setPages(res.data.pages)
                setTotal(res.data.total)
                setCurrentPage(pageNum)
            })
            .catch(err => {
                console.log(err)
            })
        //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
        return () => cancel(); 
    }

    const showAnimals = () => {
        return pets.map(pet => (
            <div key={pet._id} className="col-md-6 col-lg-4 col-xl-3">
                <PetCard pet={pet}/>
            </div>
        ))
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-12">
                    <FilterBar 
                        searchBySex={searchBySex} 
                        results={total} 
                        searchByBreed={searchByBreed}
                        sexValue={sex}
                        searchBoxtext={queryText}
                        updateSearchBoxtext={setQueryText}
                    />
                </div>
            </div>

            <div className="row">
                {!pets && <div className="col-sm-12">Loading...</div>}

                {pets && showAnimals()}
            </div>

            {pages > 1 
            && 
            <Pagination 
                pages={pages} 
                currentPage={currentPage}
                changePage={changePage}
            />
            }
        </div>
    )

}
