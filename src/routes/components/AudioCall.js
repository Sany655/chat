import React from 'react'
import { Link } from 'react-router-dom'

const AudioCall = () => {
    return (
        <div className='d-flex flex-column align-items-center justify-content-around h-100 bg-dark text-light'>
            <div className="text-center">
                <img src="" width={"200px"} height="250px" alt="" />
                <h1>Name</h1>
                <p>09876543567</p>
                <p>asdfaf@ada</p>
            </div>
            <Link className="bi bi-telephone-fill fs-2 text-danger" role={"button"} title="cancel call" to={"/chat"}></Link>
        </div>
    )
}

export default AudioCall