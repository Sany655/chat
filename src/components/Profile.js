import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

const Profile = () => {
    const url = useSelector(store => store.url)
    const socket = useSelector(store => store.socket)
    const [user, setUser] = useState({})
    const { id } = useParams()

    useEffect(() => {
        socket.emit("get_friend", id, (data) => {
            setUser(data)
            console.log(data);
        })
    }, [])

    return (
        <div className="container vh-100 d-flex justify-content-center">
            <div className="card">
                <div className="card-header">
                    <Link href="#" to={'/'}>
                        <i className="bi bi-arrow-left-circle fs-4"></i>
                    </Link>
                </div>
                <div className="card-body p-2 d-flex flex-column align-items-center">
                    <img src={user.image && url + "/images/" + user.image} alt="" className="rounded d-block w-50" />
                    <h3 className='text-center'>{user.name}</h3>
                    <p>{user.email}</p>
                    <p>{user.phone}</p>
                </div>
                {/* <div className="card-footer d-flex justify-content-between align-items-center">
                <a href="#" title='peoples'>
                    <i className="bi bi-people-fill d-lg-none fs-4"></i>
                </a>
                <a href="#" title='logout'>
                    <i className="bi bi-box-arrow-right fs-4"></i>
                </a>
            </div> */}
            </div>
        </div>
    )
}

export default Profile