import React from 'react';
import { Link, useLocation } from "react-router-dom";

import logo from '../../Assets/favicon-32x32.png'

export default function Header() {
    const location = useLocation()

    return (

        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
            <div className="container">
            <Link to='/' className="navbar-brand">
                <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Logo | The Rescue Park" /> The Rescue Park
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    <li className={`nav-item ${location.pathname === "/" && 'active'}`}>
                        <Link to="/" className="nav-link">
                            Home {location.pathname === "/shelters" && <span className="sr-only">(current)</span>}
                        </Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/shelters" && 'active'}`}>
                        <Link to="/shelters" className="nav-link">
                            Shelters {location.pathname === "/shelters" && <span className="sr-only">(current)</span>}
                        </Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/about" && 'active'}`}>
                        <Link to="/about" className="nav-link">
                            About {location.pathname === "/about" && <span className="sr-only">(current)</span>}
                        </Link>
                    </li>
                    <li className={`nav-item ${location.pathname === "/api" && 'active'}`}>
                        <Link to="/api" className="nav-link">
                            API {location.pathname === "/api" && <span className="sr-only">(current)</span>}
                        </Link>
                    </li>
                </ul>
            </div>
            </div>
        </nav>
    )
}
