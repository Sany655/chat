import React from 'react'

const UserList = () => {
    return (
        <div className="d-none d-md-block col-md-3">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-body">
                    <ul className="list-group overflow-auto">
                        <li className="list-group-item list-group-item-action active d-flex align-items-center justify-content-between">
                            <p className='m-0'>Sany</p>
                            <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p>
                        </li>
                        <li className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                            <p className='m-0'>Sany</p>
                            <p className="rounded-circle bg-light m-0" style={{ width: "15px", height: "15px" }}></p>
                        </li>
                        <li className="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
                            <p className='m-0'>Sany</p>
                            <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default UserList