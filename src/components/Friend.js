import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

const Friend = ({ friend }) => {
    const [frnd, setFrnd] = useState({})
    const [callingFriend, setCallingFriend] = useState([false, ""])
    const user = useSelector(store => store.user)
    const url = useSelector(store => store.url)
    const socket = useSelector(store => store.socket)
    useEffect(() => {
        friend.users.map(f => {
            if (user._id !== f) {
                axios.get("get_friend?friend=" + f).then(fInfo => setFrnd(fInfo.data))
                setCallingFriend([false,...callingFriend])
            }
        })
    }, [callingFriend[0]])

    useEffect(() => {
        socket.on("loggedOn", (data) => {
            setCallingFriend([true, data])
        })
    }, [])

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