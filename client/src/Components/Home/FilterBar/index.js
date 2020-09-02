import React from 'react'

export default function FilterBar({ filterSex }) {
    function updateSexFilter(e){
        filterSex(e.target.value)
    }

    return (

        <div className="card mb-4">
            <div className="card-body">
                <div className="filterBar_wrapper">
                    <label htmlFor="sex_select" style={{ marginRight: '10px' }}>Sex</label>
                    <select name="sex_select" id="sex_select" onChange={updateSexFilter}>
                        <option value={'all'}>All</option>
                        <option value={'female'}>Female</option>
                        <option value={'male'}>Male</option>
                    </select>
                </div>
            </div>
        </div>


    )
}
