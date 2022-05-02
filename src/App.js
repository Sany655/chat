import React from 'react'
import { useSelector } from 'react-redux'
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Default from './routes/layoutes/Default'
import Login from './routes/pages/Login'
import Register from './routes/pages/Register'
const App = () => {
    const user = useSelector((store) => store.user).user;

    // useEffect(() => {
    //     if (auth) {
    //         socket.emit("loggedIn", { _id: user._id })
    //     }
    // }, [auth])

    function PrivateRoute({ children }) {
        const location = useLocation();
        if (!Object.keys(user).length) {
            return <Navigate to="/login" state={{ from: location }} replace />;
        }
        return children;
    }

    function PublicRoute({ children }) {
        const location = useLocation();
        if (Object.keys(user).length) {
            return <Navigate to="/" state={{ from: location }} replace />;
        }
        return children;
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path='/*' element={<PrivateRoute><Default /></PrivateRoute>} />
                <Route path='login/*' element={<PublicRoute><Login /></PublicRoute>} />
                <Route path='register/*' element={<PublicRoute><Register /></PublicRoute>} />
            </Routes>
        </BrowserRouter>)
}

export default App