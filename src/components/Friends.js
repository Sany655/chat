import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Friend from './Friend'

const Friends = () => {
    const user = useSelector(store => store.user)
    const url = useSelector(store => store.url)
    const [callingFriends, setCallingFriends] = useState(false)
    const socket = useSelector(store => store.socket)
    const activeChatUser = useSelector(store => store.activeChatUser)
    const friends = useSelector(store => store.friends)
    const dispatch = useDispatch()
    
    socket.on("new_friend_added_from_people", () => {
        setCallingFriends(true)
    })
    useEffect(() => {
        socket.emit("get_friends", { id: user._id }, (data) => {
            dispatch({ type: "GET_FRIENDS", payload: data })
        })
    }, [callingFriends,user])

    return (
        <div className="col-lg-3 col-12">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-body overflow-auto">
                    <div className="card mb-2">
                        <div className="card-body p-2 d-flex flex-column align-items-center">
                            <img width={"120px"} height="120px" src={url + "/images/" + user.image} alt="" className="rounded-circle d-block" />
                            <h3 className='m-0 text-center'>{user.name}</h3>
                        </div>
                        <div className="card-footer d-flex justify-content-between align-items-center">
                            <a className="d-lg-none" onClick={() => dispatch({type:"TOGGLE_PEOPLE"})}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                                    <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                    <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
                                    <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                                </svg>
                            </a>
                            <a href="#" title='logout' onClick={() => dispatch({ type: "LOGOUT" })}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                    <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                    <ul className="list-group overflow-auto">
                        {
                            friends.map(friend => <Friend key={friend._id} friend={friend} activeChatUser={activeChatUser === friend._id ? activeChatUser : null} />)
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Friends