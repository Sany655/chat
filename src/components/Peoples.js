import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Peoples = ({ peoplesRef }) => {
    const peoples = useSelector(store => store.peoples)
    const friends = useSelector(store => store.friends)
    const user = useSelector(store => store.user)
    const [callPeoples, setCallPeoples] = useState(false)
    const socket = useSelector(store => store.socket)
    const url = useSelector(store => store.url)
    const dispatch = useDispatch()
    useEffect(() => {
        axios.post("/peoples", { _id: user._id,friends:friends }).then(res => {
            dispatch({ type: "GET_PEOPLES", payload: res.data })
        }).catch(err => console.log(err.message)).finally(() => setCallPeoples(false));
    }, [callPeoples, user._id]);

    socket.on("newUserFound", () => {
        // after register a new user, peaple list will have updated automaticattly
        setCallPeoples(true)
    })

    socket.on("new_friend_added_from_people", () => {
        setCallPeoples(true)
    })

    socket.on("conv_deleted", () => {
        setCallPeoples(true)
    })

    const connectPeople = (_id) => {
        socket.emit("connect_people", { user: user._id, people: _id })
    }

    return (
        <div className="col-lg-3 col-12" ref={peoplesRef}>
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-header d-flex align-items-center">
                    <div className="d-lg-none" onClick={() => dispatch({ type: "TOGGLE_PEOPLE" })}><svg style={{ width: "30px", height: "30px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                    </svg></div>
                    <h3 className="p-2">Peoples</h3>
                </div>
                <input type="search" className="form-control" placeholder='Search User' />
                <div className="card-body overflow-auto">
                    <ul className="list-group">
                        {
                            peoples.length>0 ? (
                                peoples.map(people => friends.find(friend => friend.users.find(id => id !== user._id) === people._id) ? null : (
                                    <li key={people._id} className="list-group-item d-flex align-items-center justify-content-between gap-2 overflow-auto">
                                        <div className='d-flex align-items-start justify-content-between gap-2'>
                                            <img src={people.image ? url + "/images/" + people.image : "./image/default_user.png"} style={{ width: "40px", height: "40px" }} className="rounded-circle" alt="" />
                                            <p className='m-0'><Link className='text-decoration-none' to="/">{people.name}</Link></p>
                                        </div>
                                        <button className="btn btn-primary btn-sm rounded-circle" onClick={() => connectPeople(people._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                                                <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                                <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                            </svg>
                                        </button>
                                    </li>
                                ))
                            ):(
                                <p className="d-flex justify-content-center align-items-center h-100">Reload the page agait, if it does'nt help, try letter</p>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Peoples