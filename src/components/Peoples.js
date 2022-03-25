import React from 'react'
import { Link } from 'react-router-dom'

const Peoples = () => {
    return (
        <div className="d-none d-md-block col-md-3">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-header">
                    <h3 className="p-2">Peoples</h3>
                </div>
                <input type="search" className="form-control" placeholder='Search User' />
                <div className="card-body">
                    <ul className="list-group overflow-auto">
                        <li className="list-group-item d-flex align-items-center justify-content-between">
                            <p className='m-0'><Link className='text-decoration-none' to="/">Sany</Link></p>
                            {/* <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p> */}
                            <buttton className="btn btn-primary btn-sm rounded-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person-plus-fill" viewBox="0 0 16 16">
                                    <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                    <path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z" />
                                </svg>
                            </buttton>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Peoples