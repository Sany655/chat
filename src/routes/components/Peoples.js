import React from 'react'

const Peoples = () => {
    return (
        <div className="vh-100 overflow-auto">
            <input type="search" className="form-control" placeholder='Search People'/>
            <ul className="list-group">
                {
                    [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                        <People key={i} />
                    ))
                }
            </ul>
        </div>
    )
}

function People() {
    return (
        <li className="list-group-item d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center justify-content-center gap-2">
                <img src="" alt="" width="25px" height="25px" />
                <h4>Name</h4>
            </div>
            <i className="bi bi-person-plus"></i>
        </li>
    )
}

export default Peoples