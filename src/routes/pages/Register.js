import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, Route, Routes } from 'react-router-dom';

const Register = () => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        image: null,
        password: "",
    })
    const [error, setError] = useState("")
    const [response, setResponse] = useState("")
    const [uniqueEmail, setUniqueEmail] = useState(false)
    const [loading, setLoading] = useState(false)
    const socket = useSelector(store => store.socket).socket

    function query(e) {
        e.preventDefault()
        setLoading(true)
        socket.emit("unique-email", { email: form.email }, (data) => {
            if (data) {
                setError("Email has already an account, try to login")
                setUniqueEmail(false)
                setResponse("")
            } else {
                setUniqueEmail(true)
                setError("")
                setResponse("")
            }
            setLoading(false)
        })
    }

    function submit(e) {
        setLoading(true)
        // e.preventDefault();
        // socket.emit("register", {
        //     name: form.name,
        //     email: form.email,
        //     phone: form.phone,
        //     image: form.image,
        //     password: form.password,
        // }, data => {
        //     if (data === "done") {
        //         setResponse("Registerd successsfully, Login!")
        //         setError("")
        //         setUniqueEmail(false)
        //         setForm({ email: "", name: "", password: "", phone: "", image: null })
        //         socket.emit("registered")
        //     } else {
        //         setResponse("")
        //         setError(data)
        //     }
        //     setLoading(false)
        // })
    }

    return (
        <div className="d-flex align-items-center justify-content-center vh-100">
            <div className="card">
                <div className="card-body">
                    <form onSubmit={uniqueEmail ? submit : query} encType={uniqueEmail ? "multipart/form-data" : ""}>
                        <h3 className="text-center">Registration</h3>
                        {error && <p className="alert alert-danger">{error}</p>}
                        {response && <p className="alert alert-success">{response}</p>}
                        <hr />
                        <Routes>
                            <Route path='/' element={uniqueEmail ? <Form form={form} setForm={setForm} /> : <EmailEl form={form} setForm={setForm} />} />
                        </Routes>
                        <small className="me-3">Already have an account? <Link to={'/login'}>Login</Link></small>
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

const Form = ({ form, setForm }) => {
    const [showPassword, setShowPassword] = useState(false)
    return (
        <div>
            <div className="mb-3">
                <label htmlFor="name" className="form-label">Full name</label>
                <input required type="text" className="form-control" id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="mb-3">
                <label htmlFor="phone" className="form-label">Phone number</label>
                <input required type="number" className="form-control" id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="mb-3">
                <label htmlFor="image" className="form-label">Profile picture</label>
                <input required className="form-control" type="file" id="image" accept='images/*' onChange={e => setForm({ ...form, image: e.target.files[0] })} />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <div className="input-group">
                    <input required type={showPassword ? "text" : "password"} className="form-control" id="exampleInputPassword1" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <small className='input-group-text'>
                        <i onClick={() => setShowPassword(!showPassword)} className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}></i>
                    </small>
                </div>
            </div>
        </div>
    )
}

const EmailEl = ({ form, setForm }) => {
    return (
        <div className="mb-3">
            <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
            <input required type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
    )
}

export default Register