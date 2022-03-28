import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

const Peoples = () => {
    const [peoples, setPeoples] = useState([])
    const user = useSelector(store => store.user)
    const [callPeoples, setCallPeoples] = useState(false)
    const socket = useSelector(store => store.socket)
    const url = useSelector(store => store.url)
    useEffect(() => {
        axios.post("/peoples", { _id: user._id }).then(res => {
            setPeoples(res.data);
            setCallPeoples(false)
        }).catch(err => console.log(err.message));
    }, [callPeoples, user._id]);

    socket.on("newUserFound", () => {
        // after register a new user, peaple list will have updated automaticattly
        setCallPeoples(true)
    })

    const connectPeople = (_id) => {
        axios.post("connect_people", { user: user._id, people: _id }).then(res => {
            if (res.data.acknowledged) {
                socket.emit("new_friend_added")
            }
        }).catch(err => console.log(err.message));
    }

    return (
        <div className="d-none d-md-block col-md-3">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-header">
                    <h3 className="p-2">Peoples</h3>
                </div>
                <input type="search" className="form-control" placeholder='Search User' />
                <div className="card-body overflow-auto">
                    <ul className="list-group">
                        {
                            peoples.map(people => (
                                <li key={people._id} className="list-group-item d-flex align-items-center justify-content-between gap-2 overflow-auto">
                                    <div className='d-flex align-items-start justify-content-between gap-2'>
                                        <img src={url + "/images/" + people.image} style={{ width: "40px", height: "40px" }} className="rounded-circle" alt="" />
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
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Peoples