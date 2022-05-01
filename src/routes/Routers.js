import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Default from './layoutes/Default'

const Routers = () => {
    return (
        <Routes>
            <Route path='/' element={<Default />} />
        </Routes>
    )
}

export default Routers