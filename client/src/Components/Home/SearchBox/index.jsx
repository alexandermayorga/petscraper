import React from 'react'

export default function SearchBox({ search, text, onChange}) {
    function onChangeHandler(e){
        onChange(e.target.value);
    }

    const onKeyPressHandler = (e) => {
        if (e.key === "Enter") search(e.target.value)
    }

    return (
        <div className="input-group">
            <input 
            className="form-control" 
            type="text" 
            placeholder="Search by Breed"
            aria-label="Search by Breed"
            value={text}
            onChange={(e) => onChangeHandler(e)}
            onKeyPress={(e) => onKeyPressHandler(e)}
            />
            <div className="input-group-append">
                <button 
                type="button" 
                className="btn btn-primary" 
                onClick={() => search(text)}>
                    Search
                </button>
            </div>
            
        </div>
    )
}
