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
        axios.post("/peoples", { _id: user._id, friends: friends }).then(res => {
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
                    <div className="d-lg-none">
                        <a href="#" onClick={() => dispatch({ type: "TOGGLE_PEOPLE" })}>
                            <i className="bi bi-arrow-left-circle fs-4"></i>
                        </a>
                    </div>
                    <h3 className="p-2">Peoples</h3>
                </div>
                <input type="search" className="form-control" placeholder='Search User' />
                <div className="card-body overflow-auto">
                    <ul className="list-group">
                        {
                            peoples.length > 0 ? (
                                peoples.map(people => friends.find(friend => friend.users.find(id => id !== user._id) === people._id) ? null : (
                                    <li key={people._id} className="list-group-item d-flex align-items-center justify-content-between gap-2 overflow-auto">
                                        <div className='d-flex align-items-start justify-content-between gap-2'>
                                            <img src={people.image ? url + "/images/" + people.image : "./image/default_user.png"} style={{ width: "40px", height: "40px" }} className="rounded-circle" alt="" />
                                            <p className='m-0'><Link className='text-decoration-none' to="/">{people.name}</Link></p>
                                        </div>
                                        <a href="#" onClick={() => connectPeople(people._id)}>
                                            <i className="bi bi-person-plus-fill fs-4"></i>
                                        </a>
                                    </li>
                                ))
                            ) : (
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