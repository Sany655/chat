import React from 'react'
import { useSelector } from 'react-redux'

const App = () => {
    const user = useSelector(store => store.user).user
    console.log(user);
    return (
        <div>
            <h1>Welcome Home</h1>
        </div>
    )
}

export default App