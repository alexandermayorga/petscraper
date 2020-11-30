import React from 'react'
import Layout from './Components/HOC/Layout'

import { Switch, Route } from "react-router-dom";
import Home from './Components/Home';
import About from './Components/About';
import API from './Components/API';
import Shelters from './Components/Shelters';

import './Assets/scss/main.scss';

const Routes = () => {
    return (
        <Layout>
            <Switch>
                <Route exact component={Home} path="/" />
                <Route exact component={About} path="/about" />
                <Route exact component={API} path="/api" />
                <Route exact component={Shelters} path="/shelters" />
            </Switch>
        </Layout>
    )
}

export default Routes
