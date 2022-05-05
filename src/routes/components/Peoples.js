import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Peoples = () => {
    const user = useSelector(store => store.user).user
    const socket = useSelector(store => store.socket).socket
    const dispatch = useDispatch()
    useEffect(() => {
        socket.emit("get_peoples",user.id,(data) => {
            dispatch({type:"get_peoples",payload:data})
        })
    },[])
    
    return (
        <div className="col-lg-4 col-md-8">
            <input type="search" className="form-control" placeholder='Search People'/>
            <ul className="list-group">
                {
                    [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <People key={i} />
                    ))
                }
            </ul>
        </div>
    )
}

function People() {
    return (
        <li className="list-group-item d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-center gap-2">
                <img src="" alt="" width="25px" height="25px" />
                <h4>Name</h4>
            </div>
            <i className="bi bi-person-plus"></i>
        </li>
    )
}

export default Peoples