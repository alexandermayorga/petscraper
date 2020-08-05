import React from 'react';
import { Link } from "react-router-dom";
import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavbarText
} from 'reactstrap';

import logo from '../../Assets/favicon-32x32.png'

export default function Header() {
    return (
        <div>
            <Navbar color="dark" dark expand="md">
                <div className="container">
                <Link to="/">
                    <NavbarBrand tag="div">
                        <img src={logo} width="30" height="30" alt="Logo"></img>
                    </NavbarBrand>
                </Link>
                <Nav className="mr-auto" navbar>
                    <NavItem>
                        <NavbarText>Bork!</NavbarText>
                    </NavItem>
                </Nav>
                </div>
            </Navbar>
        </div>
    )
}
