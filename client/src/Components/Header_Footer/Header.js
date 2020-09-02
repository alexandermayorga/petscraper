import React from 'react';
import { Link } from "react-router-dom";

import logo from '../../Assets/favicon-32x32.png'

export default function Header() {
    return (

        <nav className="navbar navbar-expand-sm navbar-dark bg-primary mb-4">
            <div className="container">
            <Link to='/' className="navbar-brand">
                <img src={logo} width="30" height="30" className="d-inline-block align-top" alt="Logo | The Rescue Park" /> The Rescue Park
            </Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item active">
                        {/* <NavLink to="/faq" className="nav-link" activeClassName="selected">FAQs</NavLink> */}
                        <a className="nav-link" href="#">About <span className="sr-only">(current)</span></a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Shelters</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">API</a>
                    </li>
                </ul>
            </div>
            </div>
        </nav>
    )
}
