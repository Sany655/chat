import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Header = () => {
    const user = useSelector(store => store.user).user
    const socket = useSelector(store => store.socket).socket
    const dispatch = useDispatch()

    function logout() {
        dispatch({type:"logout"})
        dispatch({type:"restart"})
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
            <div className="container">
                <a className="navbar-brand" href="#">Navbar</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto align-items-center mb-lg-0">
                        <li className="nav-item">
                            <a className="nav-link active" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Link</a>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><a className="dropdown-item" href="#">Action</a></li>
                                <li><a className="dropdown-item" href="#">Another action</a></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><a className="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <a href='#' className="nav-link" onClick={logout}>Logout</a>
                        </li>
                    </ul>
                    <form className="d-flex">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                    <div className="position-relative ms-4 d-none d-md-block" style={{ width: "50px", height: "50px" }}>
                        <img src="https://i.ytimg.com/vi/MevKTPN4ozw/hq720.jpg?sqp=-oaymwEcCNAFEJQDSFXyq4qpAw4IARUAAIhCGAFwAcABBg==&rs=AOn4CLDxRXr5b_MiTqNGHZwtmy7r-Ec-sA" width={"100%"} height="100%" className='rounded-circle' alt="" />
                        <span style={{ marginLeft: "-2px", marginBottom: "-2px" }} className={`position-absolute bottom-0 start-0 p-2 ${user.active?"bg-success":"bg-danger"} border border-light rounded-circle`}>
                            <span className="visually-hidden">New alerts</span>
                        </span>
                    </div>
                </div>
            </div>
        </nav >
    )
}

export default Header