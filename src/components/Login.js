import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'

const Login = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const login = (e) => {
        e.preventDefault();
        setLoading(true)
        axios.post("/login", form).then(res => {
            console.log(res.data);
            if (res.data._id) {
                dispatch({ type: "LOGIN", payload: res.data })
                setForm({ email: "", password: "" })
                setError("")
            } else {
                setError("Wrong Credentials, Try again")
            }
        }).catch(ree => setError(ree.message)).finally(() => {
            setLoading(false);
        })
    }
    const socket = useSelector(store => store.socket)

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={login}>
                        <h3 className="text-center">Login</h3>
                        <p className='text-danger'>{socket.id ? socket.id : "you are in offline"}</p>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <hr />
                        <div className="mb-3">
                            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                            <input required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                            <input required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} type="password" className="form-control" id="exampleInputPassword1" />
                        </div>
                        <small className='me-3'>Not have an accout? <Link to={'/register'}>Register</Link></small>
                        <button type={!loading ? "submit" : "button"} className="btn btn-primary">{loading ? (
                            <span>
                                Submitting...
                                <div className="spinner-border" style={{ width: 20, height: 20 }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </span>
                        ) : "Submit"}</button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login