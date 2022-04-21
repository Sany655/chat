import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Friend from './Friend'

const Friends = () => {
    const user = useSelector(store => store.user)
    const url = useSelector(store => store.url)
    const [callingFriends, setCallingFriends] = useState(false)
    const socket = useSelector(store => store.socket)
    const friends = useSelector(store => store.friends)
    const dispatch = useDispatch()


    useEffect(() => {
        socket.emit("get_friends", { id: user._id }, (data) => {
            dispatch({ type: "GET_FRIENDS", payload: data })
        })
    }, [callingFriends, user])

    useEffect(() => {
        socket.on("new_friend_added_from_people", () => {
            setCallingFriends(true)
        })
    }, [])

    useEffect(() => {
        socket.on("conv_deleted_for_user", () => {
            setCallingFriends(true)
            dispatch({ type: "DESELECT_CHAT" })
        })
        socket.on("conv_deleted_for_friend", (data) => {
            alert(data.name+" deleted you from her/his friend list")
            window.location.reload()
        })
    }, [])

    return (
        <div className="col-lg-3 col-12">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-body overflow-auto">
                    <div className="card mb-2">
                        <div className="card-body p-2 d-flex flex-column align-items-center">
                            <img width={"120px"} height="120px" src={url + "/images/" + user.image} alt="" className="rounded-circle d-block" />
                            <h3 className='m-0 text-center'>
                                <Link to={'/profile/'+user._id} className="text-decoration-none">{user.name}</Link>
                            </h3>
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <a href="#" title='peoples' onClick={() => dispatch({ type: "TOGGLE_PEOPLE" })}>
                                <i className="bi bi-people-fill d-lg-none fs-4"></i>
                            </a>
                            <a href="#" title='logout' onClick={() => dispatch({ type: "LOGOUT" })}>
                                <i className="bi bi-box-arrow-right fs-4"></i>
                            </a>
                        </div>
                    </div>
                    <ul className="list-group overflow-auto">
                        {
                            friends.length > 0 ? (
                                friends.map(friend => <Friend key={friend._id} friend={friend} />)
                            ) : (
                                <p className="d-flex justify-content-center align-items-center h-100 gap-2">Add a friend from people <i role={"button"} className="bi bi-people-fill d-lg-none fs-4" onClick={() => dispatch({ type: "TOGGLE_PEOPLE" })}></i></p>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Friends