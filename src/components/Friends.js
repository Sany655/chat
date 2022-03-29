import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Friend from './Friend'

const Friends = () => {
    const [friends, setFriends] = useState([])
    const user = useSelector(store => store.user)
    const url = useSelector(store => store.url)
    const [callingFriends, setCallingFriends] = useState(false)
    const socket = useSelector(store => store.socket)
    
    useEffect(() => {
        socket.on("new_friend_added", () => {
            setCallingFriends(true)
        })    
    },[])
    useEffect(() => {
        socket.emit("get_friends",{id:user._id}, (data) => {
            setFriends(data)
        })
    }, [callingFriends])

    return (
        <div className="d-none d-md-block col-md-3">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-body overflow-auto">
                    <div className="card mb-2">
                        <div className="card-body p-2 d-flex flex-column align-items-center">
                            <img width={"120px"} height="120px" src={url + "/images/" + user.image} alt="" className="rounded-circle d-block" />
                            <h3 className='m-0 text-center'>{user.name}</h3>
                        </div>
                    </div>
                    <ul className="list-group overflow-auto">
                        {
                            friends.map(friend => <Friend key={friend._id} friend={friend} />)
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Friends