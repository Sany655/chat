import React from 'react'
import { useSelector } from 'react-redux';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";
import Inbox from "./components/Inbox";
import Login from "./components/Login";
import Register from "./components/Register";

const ReactRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<PrivateRoute><Inbox /></PrivateRoute>} />
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