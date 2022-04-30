const initialState = {
    user:{}
}

function UserReducer(state = initialState,action) {
    switch (action.type) {
        case "login":
            localStorage.setItem("user",JSON.stringify(action.payload))
            return{
                ...state,
                user:action.payload
            }
            break;
        case "logout":
            localStorage.removeItem("user")
            return{
                ...state,
                user:{}
            }
            break;
    
        default:return state;
    }
}

export default UserReducer;