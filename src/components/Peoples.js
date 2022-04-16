import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'

const Peoples = ({ peoplesRef }) => {
    const peoples = useSelector(store => store.peoples)
    const friends = useSelector(store => store.friends)
    const user = useSelector(store => store.user)
    const [callPeoples, setCallPeoples] = useState(false)
    const socket = useSelector(store => store.socket)
    const url = useSelector(store => store.url)
    const [searchLoad, setSearchLoad] = useState(true)
    const dispatch = useDispatch()

    useEffect(() => {
        axios.post("/peoples", { _id: user._id, friends: friends }).then(res => {
            dispatch({ type: "GET_PEOPLES", payload: res.data })
        }).catch(err => console.log(err.message)).finally(() => setCallPeoples(false) & setSearchLoad(false));
    }, [callPeoples, user._id,friends]);

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

    let timeout = null;
    async function searchPeople(e) {
        setSearchLoad(true)
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            if (e.target.value.length) {
                axios.get("/search-people?people=" + e.target.value + "&user=" + user._id).then(res => {
                    console.log(res.data);
                    dispatch({ type: "GET_PEOPLES", payload: res.data })
                }).catch(err => console.log(err)).finally(() => setSearchLoad(false))
            } else setCallPeoples(true);
        }, 2500);
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
                <input type="search" className="form-control" placeholder='Search User' onChange={searchPeople} />
                <div className="card-body overflow-auto">
                    <ul className="list-group">
                        {
                            searchLoad ? (
                                <div className="h-100 w-100 d-flex align-items center justify-content-center">
                                    <div className="spinner-grow" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </div>
                                </div>
                            ) : peoples.length > 0 ? (
                                peoples.map(people => (
                                    <li key={people._id} className="list-group-item d-flex align-items-center justify-content-between gap-2 overflow-auto">
                                        <div className='d-flex align-items-start justify-content-between gap-2'>
                                            <img src={people.image ? url + "/images/" + people.image : "./image/default_user.png"} style={{ width: "40px", height: "40px" }} className="rounded-circle" alt="" />
                                            <p className='m-0'><Link className='text-decoration-none' to={"/profile/" + people._id}>{people.name}</Link></p>
                                        </div>
                                        {(user._id !== people._id) && (friends.filter(friend => (friend.users.find(id => id !== user._id) === people._id)).length===0) && (
                                            <a href="#" onClick={() => connectPeople(people._id)}>
                                                <i className="bi bi-person-plus-fill fs-4"></i>
                                            </a>
                                        )}
                                    </li>
                                ))
                            ) : (
                                <p className="d-flex justify-content-center align-items-center h-100">People not available at this time</p>
                            )
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Peoples