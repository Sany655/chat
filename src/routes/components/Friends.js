import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import LoadingFullPage from './LoadingFullPage'

const Friends = () => {
    const friends = useSelector(store => store.friends)
    const user = useSelector(store => store.user).user
    const socket = useSelector(store => store.socket).socket
    const [loadAgain, setLoadAgain] = useState(false)
    const fullHeight = useSelector(store => store.socket).fullHeight
    const dispatch = useDispatch()
    useEffect(() => {
        socket.emit("get_friends", user._id, (data) => {
            dispatch({ type: "get_friends", payload: data })
            setLoadAgain(false)
        })
        socket.on("call_friends", () => {
            setLoadAgain(true)
        })
    }, [loadAgain])

    if (friends.loading) {
        return (
            <LoadingFullPage />
        )
    } else if (friends.friends.length === 0) {
        return (
            <div style={{ height: fullHeight + "vh" }} className="d-flex justify-content-center align-items-center">
                Connect some friend <Link to="/peoples" className='bi bi-person-lines-fill ms-3 fs-4'></Link>
            </div>
        )
    }
    else {
        return (
            <>
                <div className="m-auto col-lg-4 lg-md-8">
                    <ul className="list-group">
                        {
                            friends.friends.map((friend, i) => <Friend key={i} friendObj={friend} />)
                        }
                    </ul>
                </div>
            </>
        )
    }
}

function Friend({ friendObj }) {
    const [friend, setFriend] = useState({})
    const user = useSelector(store => store.user).user
    const socket = useSelector(store => store.socket).socket
    const url = useSelector(store => store.socket).url
    useEffect(() => {
        socket.emit("get_friend", friendObj.users.find(id => id !== user._id) , (data) => {
            setFriend(data)
        })

        let fr = friend;
        return fr = null
    }, [])
    return (
        <li className="list-group-item d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-center gap-2">
                {friend.image&&<img src={url + friend.image} alt="" width="25px" height="25px" />}
                <Link to={"/chat"} style={{ textDecoration: "none" }}>{friend.name}</Link>
            </div>
            <i className="p-2 bg-success rounded-circle"></i>
        </li>
    )
}

export default Friends