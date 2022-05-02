import React from 'react'

const Posts = () => {
    return (
        <div>
            {
                [1,2,3,4,5,6,7,8,9].map((i) => (
                    <Post key={i}/>
                ))
            }
        </div>
    )
}

function Post() {
    return (
        <div className="card my-1">
            <div className="card-header d-flex align-items-center justify-content-between">
                <div className='d-flex align-items-center justify-content-center'>
                    <img src="" alt="" width={"50px"} height="50px" className='rounded-circle' />
                    <h1 className='mx-2'>Sany</h1>
                </div>
                <i className="bi bi-three-dots-vertical"></i>
            </div>
            <div className="card-body">
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Autem praesentium corporis hic officia ad ut fugiat qui, non possimus cum dolore quasi? Quam non quaerat omnis at voluptates, nesciunt libero!</p>
            </div>
            <div className="card-footer row m-0">
                <div className="col-6 text-center">
                    <i className="bi bi-hand-thumbs-up"></i>
                </div>
                <div className="col-6 text-center">
                    <i className="bi bi-chat-right-text"></i>
                </div>
            </div>
        </div>
    )
}

export default Posts