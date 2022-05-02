import io from "socket.io-client"

const url = "http://localhost:5000/";

const initialState = {
    socket:io.connect(url),
    url:url
}

function SocketReducer(state = initialState,action) {
    switch (action.type) {
        case "restart":
            state.socket.disconnect()
            return{
                ...state,
                socket:io.connect(url)
            }
    
        default:return state;
    }
}

export default SocketReducer;