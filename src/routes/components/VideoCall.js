import React from 'react'
import { Link } from 'react-router-dom'

const VideoCall = () => {
    return (
        <div className='d-flex flex-column align-items-center justify-content-between h-100 py-5'>
            <div>
                <video src="https://youtu.be/_Uray_OELWg" className='border' width={"70%"} height="300px" autoPlay ></video>
                <video src="https://youtu.be/CHSnz0bCaUk" className='border' width={"150px"} height="100px" autoPlay muted></video>
            </div>
            <div>
                <Link className="bi bi-telephone-fill fs-2 text-danger" role={"button"} title="cancel call" to={"/chat"}></Link>
            </div>
        </div>
    )
}

export default VideoCall