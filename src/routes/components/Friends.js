import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Friends = () => {
    const user = useSelector(store => store.user)
    const socket = useSelector(store => store.socket)
    const dispatch = useDispatch()

    function logout() {
        dispatch({type:"logout"})    
        dispatch({type:"restart"})    
    }

    return (
        <>
            <div className="container">
                {/* <div className="d-flex flex-column align-items-center justify-content-center gap-3 my-3">
                    <img src={socket.url+user.user.image} className='rounded-circle' width={"130px"} height="130px" alt="" />
                    <h4 className='text-center'>{user.user.name}</h4>
                    <div className="list-group-item d-flex align-items-center justify-content-between w-100">
                        <i className="bi bi-gear fs-4" role={"button"}></i>
                        <i className="bi bi-box-arrow-right fs-4" role={"button"} onClick={logout}></i>
                    </div>
                </div> */}
                <ul className="list-group">
                    {
                        [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 22, 33, 44, 55, 66, 77].map((i) => (
                            <Friend key={i} />
                        ))
                    }
                </ul>
            </div>
        </>
    )
}

function Friend() {
    return (
        <li className="list-group-item d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-center gap-2">
                <img src="" alt="" width="25px" height="25px" />
                <Link to={"/chat"} style={{ textDecoration: "none" }}>Name</Link>
            </div>
            <i className="p-2 bg-success rounded-circle"></i>
        </li>
    )
}

export default Friends