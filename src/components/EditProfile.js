import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

const EditProfile = () => {
    const { id } = useParams()
    const socket = useSelector(store => store.socket)
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const navigate = useNavigate();
    const dispatch = useDispatch()

    useEffect(() => {
        socket.emit("get_user", id, (data) => {
            data.old_image = data.image
            delete data.image
            setForm(data)
        })
    }, [])

    function updateProfile(e) {
        e.preventDefault()
        setLoading(true)
        const fd = new FormData();
        fd.append("name", form.name);
        fd.append("password", form.password);
        fd.append("phone", form.phone);
        fd.append("image", form.image);
        fd.append("old_image", form.old_image);
        fd.append("_id", form._id);
        axios.post("update-profile", fd).then(res => {
            dispatch({type:"LOGIN",payload:res.data})
            alert("Profile updated")
            window.location.href = "/"
        }).catch(err => console.log(err.message)).finally(() => setLoading(false))
    }

    return (
        <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
            <div className="card">
                <div className="card-body">
                    <h3 className="mb-3">Editing Profile</h3>
                    <form onSubmit={updateProfile} encType="multipart/form-data">
                        <div className="mb-3">
                            <label htmlFor="name" className="form-label">Full name</label>
                            <input required type="text" className="form-control" id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="phone" className="form-label">Phone number</label>
                            <input required type="number" className="form-control" id="phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="image" className="form-label">Profile picture - Don't choose if don't want to change</label>
                            <input className="form-control" type="file" id="image" accept='images/*' value={form.image} onChange={e => setForm({ ...form, image: e.target.files[0] })} />
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
                        <button type={!loading ? "submit" : "button"} className="btn btn-primary">{loading ? (
                            <span>
                                Submitting...
                                <div className="spinner-border" style={{ width: 20, height: 20 }} role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </span>
                        ) : "Submit"}</button>
                        <button type='reset' className="btn btn-secondary ms-2" onClick={() => navigate(-1)}>Cancel</button>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default EditProfile