import React from 'react'
import Header from '../Header_Footer/Header'
import Footer from '../Header_Footer/Footer'

const Layout = (props) => {
    return (
        <>
            <Header />
            {props.children}
            <Footer />
        </>
    )
}

export default Layout
