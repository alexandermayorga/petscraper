import React from 'react'

export default function Shelters() {
    return (
        <section style={{ minHeight: "80vh", marginTop: "-1.5rem" }}>
            <div class="jumbotron jumbotron-fluid bg-primary text-light">
                <div class="container">
                    <h1 class="display-4">Shelters</h1>
                    <p class="lead">Current list of Houston, TX shelters where the app is fetching data from</p>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-6 col-lg-4">
                        <div className="card mb-4">
                            <div className="card-body">
                                <address>
                                    <strong>Adopt A Rescued Friend, Inc</strong><br />
                                    19418 Craigchester Ln<br />
                                    Spring, TX 77388<br />
                                    <abbr title="Phone"><i class="fa fa-phone-square" aria-hidden="true"></i></abbr> (832) 539-4004<br />
                                    <abbr title="Email"><i class="fa fa-envelope" aria-hidden="true"></i></abbr> <a href="mailto:info@aarfhouston.org">info@aarfhouston.org</a>
                                    <div className="shelterNfo__website">
                                        <i class="fa fa-globe" aria-hidden="true"></i> <a href="https://www.aarfhouston.org/">aarfhouston.org</a>
                                    </div>
                                </address>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-12 col-md-6 col-lg-4">
                        <div className="card mb-4">
                            <div className="card-body">
                                <address>
                                    <strong>Houston SPCA</strong><br />
                                    7007 Old Katy Road<br />
                                    Houston, Texas 77024<br />
                                    <abbr title="Phone"><i class="fa fa-phone-square" aria-hidden="true"></i></abbr> (713) 869-SPCA (7722)<br />
                                    <abbr title="Email"><i class="fa fa-envelope" aria-hidden="true"></i></abbr> N/A
                                    <div className="shelterNfo__website">
                                        <i class="fa fa-globe" aria-hidden="true"></i> <a href="https://www.houstonspca.org/">houstonspca.org</a>
                                    </div>
                                </address>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
