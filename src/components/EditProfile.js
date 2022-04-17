import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

const EditProfile = () => {
    const { id } = useParams()
    const socket = useSelector(store => store.socket)
    const [editingUser, setEditingUser] = useState({})
    const [form, setForm] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        socket.emit("get_user", (data) => {
            setEditingUser(data)
        })
    }, [])
    return (
        <div className="vh-100 vw-100 d-flex justify-content-center align-items-center">
            <div className="card">
                <div className="card-body">
                    <h3 className="mb-3">Editing Profile</h3>
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
                        <input required type="password" className="form-control" id="exampleInputPassword1" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    </div>
                    <button type={!loading ? "submit" : "button"} className="btn btn-primary">{loading ? (
                        <span>
                            Submitting...
                            <div className="spinner-border" style={{ width: 20, height: 20 }} role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </span>
                    ) : "Submit"}</button>
                </div>
            </div>
        </div>
    )
}

export default EditProfile