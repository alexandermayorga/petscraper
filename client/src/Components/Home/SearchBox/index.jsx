import React, {useRef} from 'react'

export default function SearchBox({onChange}) {

    const inputEl = useRef('');

    const handleKeyPress = (e) => {
        if (e.key === "Enter") onChange(inputEl.current.value);
    }

    const handleClick = () =>{
        onChange(inputEl.current.value)
    }

    return (
        <div className="input-group">
            <input 
            className="form-control" 
            type="text" 
            placeholder="Search by Breed"
            aria-label="Search by Breed"
            ref={inputEl}
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
