import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Routers from './routes/Routers'

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Routers />} />
            </Routes>
        </BrowserRouter>)
}

export default App