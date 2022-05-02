import React from 'react'
import Footer from '../components/Footer'
import Header from '../components/Header'
import Home from '../pages/Home'

const Default = () => {
    return (
        <main>
            {/* <Header /> */}
            <div className="container-fluid">
                <Home />
            </div>
            {/* <Footer /> */}
        </main>
    )
}

export default Default