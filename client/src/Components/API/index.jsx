import React from 'react'

export default function API() {
    return (
        <section style={{ minHeight: "80vh", marginTop: "-1.5rem" }}>
            <div className="jumbotron jumbotron-fluid bg-primary text-light">
                <div className="container">
                    <h1 className="display-4">API</h1>
                    <p className="lead">API documentation</p>
                </div>
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="display-4">API end points</div>
                        <hr/>
                        <div className="h3">Get all Documents</div>
                        <p>
                            By default you will get 20 documents. You can define the amount of results and the offset (see more below).
                        </p>
                        <code className="bg-white d-block p-3 rounded mb-4" style={{ boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>
                            https://petscraper.herokuapp.com/api/animals/
                        </code>
                        <div className="h3">Filter by Sex</div>
                        <p>
                            You can filter out your results by sex. The ":sex" parameter accepts "male" and "female".
                        </p>
                        <code className="bg-white d-block p-3 rounded mb-4" style={{ boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>
                            https://petscraper.herokuapp.com/api/animals/sex/:sex
                        </code>
                        <div className="h3">Search by Breed</div>
                        <p>
                            You can submit a GET request with your "SEARCH_TEXT" as the value for the "breed" query parameter.
                        </p>
                        <code className="bg-white d-block p-3 rounded mb-4" style={{ boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}>
                            https://petscraper.herokuapp.com/api/search?breed=SEARCH_TEXT
                        </code>
                        <div className="d-block p-4"></div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <div className="display-4">Results</div>
                        <hr />
                        <p>
                            If <strong>"size"</strong> and <strong>"offset"</strong> are not specified, by default you will get the first 20 documents. Below is an example setting size to 20 and offset to 60. 
                        </p>
                        <code className="bg-white d-block p-3 rounded mb-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
                            {`{`} <br />
                                "total" : 64,<br />
                                "pages" : 4, <br/>
                                "size" : 20,<br />
                                "offset" : 60,<br />
                                "count" : 4,<br />
                                "results" : [{`{`}Animal.Documents{`}`},...]<br />
                            {`}`}
                        </code>
                        <ul>
                            <li>In this example, there are <strong>64</strong> total results. </li>
                            <li>Because the offset is <strong>60</strong> and there are only <strong>4</strong> documents remaining. Hence, "count" is 4.</li>
                            <li>The <strong>"pages"</strong> parameter is equal to <strong>( total results / size )</strong>. In case you need pagination :).</li>
                        </ul>

                        <div className="h2">Animal Documents</div>
                        <p>
                            Here is how the Animal documents look like.
                        </p>
                        <code className="bg-white d-block p-3 rounded mb-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}>
                            {`{`} <br />
                                "imgs" : [String],<br />
                                "status" : String, <br />
                                "_id" : String,<br />
                                "petURI" : String,<br />
                                "domain" : String,<br />
                                "petId" : String,<br />
                                "age" : String,<br />
                                "breed" : String,<br />
                                "sex" : String,<br />
                                "name" : String,<br />
                            {`}`}
                        </code>

                        <div className="h2">Description</div>
                        <ul>
                            <li><strong>"imgs" :</strong> An Array of Strings. This are links to the animal images</li>
                            <li><strong>"status" :</strong> You will only get "Active". The app runs every day and 'deactivates' any animals that are no longer active on origin site</li>
                            <li><strong>"_id" :</strong> The document ID</li>
                            <li><strong>"petURI" :</strong> The URI to the animal's profile in the origin site</li>
                            <li><strong>"domain" :</strong> The URI to the origin site</li>
                            <li><strong>"petId" :</strong> The ID of the animal in the origin site</li>
                            <li><strong>"age" :</strong> The animal age. Descriptions change from site to site so this can look like "Young" or "3"</li>
                            <li><strong>"breed" :</strong> The animal's breed</li>
                            <li><strong>"sex" :</strong> The animal's sex</li>
                            <li><strong>"name" :</strong> The animal's name</li>
                        </ul>
                        <div className="d-block p-5"></div>
                    </div>
                </div>
            </div>

        </section>
    )
}
