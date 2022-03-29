import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const Friend = ({ friend }) => {
    const [frnd, setFrnd] = useState({})
    const user = useSelector(store => store.user)
    const url = useSelector(store => store.url)
    const socket = useSelector(store => store.socket)
    useEffect(() => {
        const frndId = friend.users.find(f => f !== user._id);
        getFriendWithSocket(frndId)
    }, [])

    useEffect(() => {
        socket.on("loggedOn", (data) => {
            const frndId = friend.users.find(f => f !== user._id);
            if (data === frndId) {
                getFriendWithSocket(data)
            }
        })
    }, [])

    function getFriendWithSocket(frndId) {
        socket.emit("get_friend", frndId, (data) => {
            setFrnd(data)
        })
    }

    return (
        <li className={`list-group-item ${frnd.as && "active"} d-flex align-items-center justify-content-between overflow-auto`}>
            <div className="d-flex align-items-start justify-content-center gap-2">
                <img src={frnd.image && url + "/images/" + frnd.image} width="40px" height={"40px"} className="rounded-circle" alt="" />
                <p className='m-0'>{frnd.name}</p>
            </div>
            {
                frnd.active ? <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p> : <p className="rounded-circle m-0" style={{ width: "15px", height: "15px", background: "#e0e0e0" }}></p>
            }

        </li>
    )
}

export default Friend