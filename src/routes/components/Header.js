import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { Collapse } from 'bootstrap'

const Header = () => {
    const user = useSelector(store => store.user).user
    const socket = useSelector(store => store.socket).socket
    const dispatch = useDispatch()

    function logout() {
        dispatch({ type: "logout" })
        dispatch({ type: "restart" })
    }

    useEffect(() => {
        const navLinks = document.querySelectorAll('.nav-item')
        const btn = document.querySelector('.navbar-toggler')
        const menuToggle = document.getElementById('navbarSupportedContent')
        const bsCollapse = new Collapse(menuToggle,{
            toggle:false
        })
        btn.addEventListener('click', () => { bsCollapse.toggle() })
        window.addEventListener('click', () => { bsCollapse.hide() })
        navLinks.forEach((l) => {
            l.addEventListener('click', () => { bsCollapse.toggle() })
        })
    }, [])

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <a className="navbar-brand" href="#">Calling Dudes</a>
                <button className="navbar-toggler" type="button" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav align-items-center mb-lg-0">
                        <li className="nav-item">
                            <NavLink to='/' className="nav-link">Friends</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to='/peoples' className="nav-link">Peoples</NavLink>
                        </li>
                        <li className="nav-item">
                            <a href='#' className="nav-link" onClick={logout}>Logout</a>
                        </li>
                    </ul>
                    <form className="d-flex ms-auto">
                        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" />
                        <button className="btn btn-outline-success" type="submit">Search</button>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Header