import React from 'react'

const WritePost = () => {

    function post(e) {
        e.preventDefault()
    }

    return (
        <div className='my-2'>
            <form onSubmit={post}>
                <div style={{position:"relative"}}>
                    <textarea className='form-control mb-2' style={{resize:"none"}} placeholder='Write post'></textarea>
                    <div style={{position:"absolute",bottom:5,right:10,display:"flex",gap:10}}>
                        <i className="bi bi-images" role={"button"}></i>
                        <i className="bi bi-emoji-smile" role={"button"}></i>
                    </div>
                </div>
                <button className="btn btn-primary d-block ms-auto">Post <i className="bi bi-pencil-square"></i></button>
            </form >
        </div >
    )
}

export default WritePost