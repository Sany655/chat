import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Friends from './components/Friends';
import Inbox from "./components/Inbox";
import Loading from './components/Loading';
import Login from "./components/Login";
import Peoples from './components/Peoples';
import Register from "./components/Register";

const ReactRoutes = () => {
    const socket = useSelector(store => store.socket)
    const user = useSelector(store => store.user)
    const auth = useSelector(store => store.auth)

    useEffect(() => {
        if (auth) {
            socket.emit("loggedIn", { _id: user._id })
        }
    }, [auth])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRoute><Inbox /></PrivateRoute>} />
                <Route path="/peoples" element={<PrivateRoute><Peoples /></PrivateRoute>} />
                <Route path="/friends" element={<PrivateRoute><Friends /></PrivateRoute>} />
                <Route path='/login' element={<PublicRoute><Login /></PublicRoute>} />
                <Route path='/register/*' element={<PublicRoute><Register /></PublicRoute>} />
            </Routes>
        </BrowserRouter>
    )
}


function PrivateRoute({ children }) {
    let auth = useSelector((store) => store.auth);
    let location = useLocation();

    if (!auth) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return children;
}

function PublicRoute({ children }) {
    let auth = useSelector((store) => store.auth);
    let location = useLocation();

    if (auth) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return children;
}

export default ReactRoutes