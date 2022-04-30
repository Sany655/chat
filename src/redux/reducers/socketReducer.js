import io from "socket.io-client"

const initialState = {
    socket:io()
}

function SocketReducer(state = initialState,action) {
    switch ("key") {
        case "value":
            
            break;
    
        default:return state;
    }
}

export default SocketReducer;