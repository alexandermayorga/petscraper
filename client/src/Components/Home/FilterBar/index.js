import React from 'react'
import SearchBox from '../SearchBox'

export default function FilterBar({
  results,
  sexValue,
  onSearchBoxChange,
  onSexFilterChange,
}) {

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="filterBar_wrapper d-flex justify-content-between flex-wrap">
          <div className="mb-4 mb-sm-0">
            <strong>Results:</strong> {results}
          </div>
          <div className="mb-4 mb-sm-0">
            <SearchBox onChange={onSearchBoxChange} />
          </div>
          <div>
            <label htmlFor="sex_select" style={{ marginRight: "10px" }}>
              <strong>Sex</strong>
            </label>
            <select value={sexValue} onChange={(e) =>{onSexFilterChange(e.target.value);}}>
              <option value={"all"}>All</option>
              <option value={"female"}>Female</option>
              <option value={"male"}>Male</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
