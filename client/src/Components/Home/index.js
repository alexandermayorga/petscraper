import React, { useState, useEffect } from "react";

import axios from "axios";
import PetCard from "./PetCard";
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";

const baseURI = "/api/search";

export default function Home() {
  const [petData, setPetData] = useState({
    petList: null,
    pages: null,
    total: null,
  });
  const [uriParams, setUriParams] = useState({
    currentPage: 1,
    sex: "all",
    queryText: "",
  });

  useEffect(() => {
      console.log('[useEfffect]');
    const { currentPage, sex, queryText } = uriParams;

    let fetchURI = `${baseURI}?breed=${queryText}`;

    if (sex !== "all") fetchURI += `&sex=${sex}`;
    if (currentPage !== 1) fetchURI += `&offset=${20 * (currentPage - 1)}`;

    let cancel;

    axios
      .get(fetchURI, {
        cancelToken: new axios.CancelToken((c) => (cancel = c)),
      })
      .then((res) => {

      console.log("[useEfffect] --> Resolved");
        setPetData({
          petList: res.data.results,
          pages: res.data.pages,
          total: res.data.total,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    //Cancel Old requests if new requests are made. This way old data doesn't load if old request finishes after new request
    return () => cancel();
  }, [uriParams]);

  const handleSearchFilter = (newValue) => {
    setUriParams((prevState) => {
      return { ...prevState, queryText: newValue, currentPage: 1 };
    });
  };
  const handleSexFilterChange = (newValue) => {
    setUriParams((prevState) => {
      return { ...prevState, sex: newValue, currentPage: 1 };
    });
  };
  const handlePageChange = (newValue) => {
    setUriParams((prevState) => {
      return { ...prevState, currentPage: newValue };
    });
  };
  const handleFiltersReset = () => {
    setUriParams({
      currentPage: 1,
      sex: "all",
      queryText: "",
    });
  };

  const { petList, pages, total } = petData;
  const { currentPage, sex, queryText } = uriParams;

  const showAnimalList = () => {
    return petList.map((pet) => (
      <div key={pet._id} className="col-md-6 col-lg-4 col-xl-3">
        <PetCard pet={pet} />
      </div>
    ));
  };

  const noResultsTemplate = (
    <div className="col">
      <div className="card mb-4">
        <div className="card-body p-5 text-muted text-center ">
          <div className="h3 mb-3">
            Oh No! There are no results matching your search
          </div>
          <p>Maybe try a different keyword like "Terrier"</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <FilterBar
            results={total}
            queryText={queryText}
            onSearch={handleSearchFilter}
            sexValue={sex}
            onSexFilterChange={handleSexFilterChange}
            onFiltersReset={handleFiltersReset}
          />
        </div>
      </div>

      <div className="row">
        {!petList && <div className="col-sm-12">Loading...</div>}

        {petList && showAnimalList()}

        {petList && petList.length < 1 && noResultsTemplate}
      </div>

      {pages > 1 && (
        <Pagination
          pages={pages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}
