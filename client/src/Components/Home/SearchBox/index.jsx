import React, {useState} from 'react'

export default function SearchBox({onSearch,inputText,onChange}) {

    const handleKeyPress = (e) => {
        if (e.key === "Enter") onSearch(inputText);
    }

    const handleClick = () =>{
        onSearch(inputText)
    }

    return (
        <div className="input-group">
            <input 
            className="form-control" 
            type="text" 
            placeholder="Search by Breed"
            aria-label="Search by Breed"
            value={inputText}
            onChange={(e)=>{onChange(e.target.value)}}
            onKeyPress={handleKeyPress}
            />
            <div className="input-group-append">
                <button 
                type="button"
                className="btn btn-primary" 
                onClick={handleClick}
                >
                    Search
                </button>
            </div>
            
        </div>
    )
}
