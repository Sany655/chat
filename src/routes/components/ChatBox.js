import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const ChatBox = () => {
    const chat = useSelector(state => state.chat)

    const [navbarHeight, setNavbarHeight] = useState(0)

    useEffect(() => {
        setNavbarHeight(document.querySelector(".navbar").offsetHeight*(100/window.innerHeight))
    }, [])

    return (
        <div className="container" style={{ height: (100 - navbarHeight) + "vh" }}>
            <div className="card h-100">
                <div className="card-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-center gap-3">
                        {chat.isSelectedChatUser && <i className="bi bi-arrow-left-circle fs-2 d-block d-lg-none" role={"button"}></i>}
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
                    <p className="bg-success text-light p-2 rounded text-start">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sapiente deserunt numquam natus saepe ea. Illo rerum ad tenetur eum, aperiam impedit quis animi saepe facere libero. Neque adipisci nobis itaque!</p>
                    <p className="bg-light text-end p-2 rounded">Lorem ipsum dolor sit amet.</p>
                </div>
                <div className="card-footer">
                    <div className="input-group mb-3">
                        <input type="text" className="form-control" placeholder="Write some message" />
                        <span className="input-group-text bi bi-send" role={"button"} id="basic-addon1"></span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatBox