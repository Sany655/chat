import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Peoples = () => {
    const user = useSelector(store => store.user).user
    const peoples = useSelector(store => store.peoples).peoples
    const socket = useSelector(store => store.socket)
    const dispatch = useDispatch()

    useEffect(() => {
        socket.socket.emit("get_peoples", user._id, (data) => {
            dispatch({ type: "get_peoples", payload: data })
        })
    }, [])

    function connectAsFriend(id) {
        // socket.emit("connect_friend",id,(data) => {

        // })
    }

    return (
        <div className="col-lg-4 col-md-8 m-auto">
            <input type="search" className="form-control" placeholder='Search People' />
            <ul className="list-group">
                {
                    peoples.map((people,i) => (
                        <li key={i} className="list-group-item d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center justify-content-center gap-2">
                                <img src={socket.url + people.image} alt="" width="25px" height="25px" />
                                <h4>{people.name}</h4>
                            </div>
                            <i className="bi bi-person-plus fs-4" role={"button"} onClick={() => connectAsFriend(people._id)}></i>
                        </li>
                    ))
                }
            </ul>
        </div>
    )
}

export default Peoples