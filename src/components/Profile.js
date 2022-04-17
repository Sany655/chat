import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'

const Profile = () => {
    const url = useSelector(store => store.url)
    const socket = useSelector(store => store.socket)
    const user = useSelector(store => store.user)
    const [pageUser, setPageUser] = useState({})
    const { id } = useParams()

    useEffect(() => {
        socket.emit("get_user", id, (data) => {
            setPageUser(data)
        })
    }, [])

    return (
        <div className="container">
            <div className="card">
                <div className="card-header">
                    <Link href="#" to={'/'}>
                        <i className="bi bi-arrow-left-circle fs-4"></i>
                    </Link>
                    {
                        user._id === pageUser._id ? (
                            <>
                                <Link href="#" to={'/profile/' + user._id + '/edit'} className="ms-2 fs-4" title='Edit profile'>
                                    <i class="bi bi-pencil-square"></i>
                                </Link>
                            </>
                        ) : null
                    }
                </div>
                <div className="card-body p-2 d-flex flex-column align-items-center">
                    <img src={pageUser.image && url + "/images/" + pageUser.image} alt="" className="rounded d-block w-50" />
                    <h3 className='text-center'>{pageUser.name}</h3>
                    <p>{pageUser.email}</p>
                    <p>{pageUser.phone}</p>
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