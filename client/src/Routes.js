import React from 'react'
import Layout from './Components/HOC/Layout'

import { Switch, Route } from "react-router-dom";
import Home from './Components/Home';

import './Assets/scss/main.scss';

const Routes = (props) => {
    return (
        <Layout>
            <Switch>
                <Route exact component={Home} path="/" />
            </Switch>
        </Layout>
    )
}

export default Routes
