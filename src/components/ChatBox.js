import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

const ChatBox = () => {
    const dispatch = useDispatch()
    const [time, setTime] = useState()
    
    setInterval(() => {
        setTime(new Date().toLocaleString());
    }, 500);
    
    return (
        <div className="col-12 col-md-6">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-block d-md-none"><Link to={'/'}><svg style={{ width: "30px", height: "30px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                        </svg></Link></div>
                        <img src="https://m.media-amazon.com/images/M/MV5BMTY2ODQ3NjMyMl5BMl5BanBnXkFtZTcwODg0MTUzNA@@._V1_.jpg" alt="" className="rounded-circle" width={65} height={65} />
                        <div className="">
                            <h5>Mohammad Mazharul Alam</h5>
                            <small>{time}</small>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p>
                        <a href="#" title='logout' onClick={() => dispatch({type:"LOGOUT"})}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="card-body overflow-auto">
                    <p className="bg-primary text-light p-2 rounded text-end">Lorem ipsum, dolor sit ame</p>
                    <p className="bg-light text-dark p-2 rounded">Lorem ipsum, dolor sit</p>
                    <p className="bg-primary text-light p-2 rounded text-end">Lorem ipsum, dolor sit ame</p>
                    <p className="bg-light text-dark p-2 rounded">Lorem ipsum, dolor sit</p>
                </div>
                <div className="card-footer d-flex align-items-center gap-2">
                    <input type="text" className="form-control" placeholder='write message' />
                    <button className="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                    </svg></button>
                </div>
            </div>
        </div>
    )
}

export default ChatBox