import React, { useEffect, useState } from 'react'
import Peoples from "../components/Peoples"
import Friends from '../components/Friends'
import ChatBox from '../components/ChatBox'
import { Link, Route, Routes } from 'react-router-dom'
import Profile from '../components/Profile'
import AudioCall from '../components/AudioCall'
import VideoCall from '../components/VideoCall'
import { useSelector } from 'react-redux'

const Home = () => {

    

    function Default() {
        return (
            <div className="d-flex align-items-center justify-content-center h-100">
                <h3>Choose a friend to say hi</h3>
            </div>
        )
    }

    return (
        <div className="row">
            {window.innerWidth > 720 && (
                <div className={`col-12 col-lg-2 ${window.location.pathname === '/profile' ? "d-none" : null}`}>
                    <Friends />
                </div>
            )}
            <div className={`col-12 col-lg-8`}>
                <div className="card vh-100">
                    <div className="card-header d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center justify-content-center gap-3">
                            {(window.location.pathname !== '/') && <Link className="bi bi-arrow-left-circle fs-2 d-block d-lg-none text-decoration-none text-dark" role={"button"}></Link>}
                            <img src="" alt="" width="50px" height="50px" />
                            <Link to={"/profile"} style={{ textDecoration: "none" }}><h4>Name</h4></Link>
                        </div>
                        <div className="d-flex align-items-center justify-content-center gap-4">
                            <i className="bi bi-telephone fs-4"></i>
                            <i className="bi bi-camera-video fs-4"></i>
                            <i className="p-2 bg-success rounded-circle"></i>
                        </div>
                    </div>
                    <div className="card-body">

                    </div>
                    <div className="card-footer">
                        <div className="input-group mb-3">
                            <input type="text" className="form-control" placeholder="Write some message" />
                            <span className="input-group-text bi bi-send" role={"button"} id="basic-addon1"></span>
                        </div>
                    </div>
                </div>
            </div>
            {window.innerWidth > 720 && (
                <div className="d-none d-lg-block col-2" >
                    <Peoples />
                </div>
            )}
        </div>
    )
}

export default Home