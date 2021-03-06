import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Loading from "./Loading"

const Friend = ({ friend }) => {
    const [frnd, setFrnd] = useState({})
    const dispatch = useDispatch()
    const user = useSelector(store => store.user)
    const url = useSelector(store => store.url)
    const socket = useSelector(store => store.socket)
    const activeChatUser = useSelector(store => store.activeChatUser)

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
        socket.emit("get_user", frndId, (data) => {
            setFrnd(data)
        })
    }

    return (
        <li role="button" className={`list-group-item list-group-item-action ${(activeChatUser._id === friend._id) && "active"} d-flex align-items-center justify-content-between overflow-auto`} onClick={() => dispatch({ type: "SELECT_CHAT", payload: friend })}>
            {
                frnd._id ? (
                    <>
                        <div className="d-flex align-items-start justify-content-center gap-2">
                            <img src={frnd.image && url + "/images/" + frnd.image} width="40px" height={"40px"} className="rounded-circle" alt="" />
                            <p className='m-0'>{frnd.name}</p>
                        </div>
                        <div className='d-flex align-items-center gap-2'>
                            {
                                frnd.active ? (
                                    <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p>
                                ) : (
                                    <p className="rounded-circle m-0" style={{ width: "15px", height: "15px", background: "#e0e0e0" }}></p>
                                )
                            }
                        </div>
                    </>
                ) : <Loading />
            }
        </li>
    )
}

export default Friend