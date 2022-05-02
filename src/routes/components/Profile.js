import React from 'react'
import { Link } from 'react-router-dom'

const Profile = () => {
    return (
        <div className="d-flex flex-column align-items-center justify-content-center gap-3 my-3">
            <div className="list-group-item d-flex align-items-center justify-content-between gap-4 w-100">
                {/* <i className="bi bi-arrow-left-circle fs-2" role={"button"}></i> */}
                <Link to={'/'} className="bi bi-arrow-left-circle fs-2 text-dark"></Link>
                <div className="d-flex align-items-center justify-content-center gap-3">
                    <i className="bi bi-telephone fs-4"></i>
                    <i className="bi bi-camera-video fs-4"></i>
                    <i className="bi bi-gear fs-4" role={"button"}></i>
                    <i className="p-2 bg-success rounded-circle"></i>
                </div>
            </div>
            <img src="" className='rounded-circle' width={"130px"} height="130px" alt="" />
            <h4 className='text-center'>Name</h4>
            <p>masdf@sdf</p>
            <p>009876544444</p>
        </div>
    )
}

export default Profile