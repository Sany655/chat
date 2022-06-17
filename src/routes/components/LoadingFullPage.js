import React from 'react'
import { useSelector } from 'react-redux'

const LoadingFullPage = () => {
    const fullHeight = useSelector(store => store.socket).fullHeight
    return (
        <div style={{ height: fullHeight + "vh" }} className="d-flex justify-content-center align-items-center">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    )
}

export default LoadingFullPage