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
        // console.log("useEffect[Init] -> Resolved");
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

  const handleSearchBoxChange = (newValue) => {
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

  const { petList, pages, total } = petData;
  const { currentPage, sex } = uriParams;

  const showAnimalList = () => {
    return petList.map((pet) => (
      <div key={pet._id} className="col-md-6 col-lg-4 col-xl-3">
        <PetCard pet={pet} />
      </div>
    ));
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-12">
          <FilterBar
            results={total}
            onSearchBoxChange={handleSearchBoxChange}
            sexValue={sex}
            onSexFilterChange={handleSexFilterChange}
          />
        </div>
      </div>

      <div className="row">
        {!petList && <div className="col-sm-12">Loading...</div>}

        {petList && showAnimalList()}
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
