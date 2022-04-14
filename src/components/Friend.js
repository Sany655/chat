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
    const isChatSelected = useSelector(store => store.isChatSelected)

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

    function deleteFriend() {
        const con = window.confirm("are you sure to delete this friend and it's conversation")
        if (con) {
            friend.friend = frnd;
            socket.emit("delete_frnd_conv", friend, (data) => {
                alert(data)
            })
        }
    }

    return (
        <li className={`list-group-item list-group-item-action ${isChatSelected && (activeChatUser._id === friend._id) && "active"} d-flex align-items-center justify-content-between overflow-auto`}>
            {
                frnd._id ? (
                    <>
                        <div role="button" className="d-flex align-items-start justify-content-center gap-2" onClick={() => dispatch({ type: "SELECT_CHAT", payload: friend })&dispatch({type:"IS_CHAT_SELECTED_TRUE"})}>
                            <img src={frnd.image && url + "/images/" + frnd.image} width="40px" height={"40px"} className="rounded-circle" alt="" />
                            <p className='m-0'>{frnd.name}</p>
                        </div>
                        <div className='d-flex gap-2'>
                            {
                                frnd.active ? (
                                    <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p>
                                ) : (
                                    <p className="rounded-circle m-0" style={{ width: "15px", height: "15px", background: "#e0e0e0" }}></p>
                                )
                            }
                            <img role="button" src="./svg/trash.svg" alt="trash" width='20px' onClick={deleteFriend} />
                        </div>
                    </>
                ) : <Loading />
            }
        </li>
    )
}

export default Friend