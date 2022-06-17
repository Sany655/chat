import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import LoadingFullPage from './LoadingFullPage'

const Peoples = () => {
    const user = useSelector(store => store.user).user
    const peoples = useSelector(store => store.peoples).peoples
    const loading = useSelector(store => store.peoples).loading
    const socket = useSelector(store => store.socket)
    const dispatch = useDispatch()
    let [loadAgain, setLoadAgain] = useState(false)

    useEffect(() => {
        socket.socket.emit("get_peoples", user._id, (data) => {
            dispatch({ type: "get_peoples", payload: data });
            setLoadAgain(false)
        })
        socket.socket.on("call_peoples", () => {
            setLoadAgain(true)
        })
        return loadAgain = null
    }, [loadAgain])

    function connectAsFriend(people) {
        socket.socket.emit("connect_friend", { people: people, user: user._id }, (data) => {
            if (data) {
                socket.socket.emit("call_peoples", { me: socket.socket.id, friend: people.socket })
                socket.socket.emit("call_friends", { me: socket.socket.id, friend: people.socket })
            }
        })
    }

    return (
        <div className="col-lg-4 col-md-8 m-auto">
            <input type="search" className="form-control" placeholder='Search People' />
            <ul className="list-group">
                {
                    loading ? (
                        <div className="my-5 text-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : peoples.length === 0 ? <h3 className="my-5 text-center">No one availbe at this time</h3> : peoples.map((people, i) => (
                        <li key={i} className="list-group-item d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <img src={socket.url + people.image} alt="" width="25px" height="25px" />
                                <h4>{people.name}</h4>
                            </div>
                            <i className="bi bi-person-plus fs-4" role={"button"} onClick={() => connectAsFriend(people)}></i>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Peoples