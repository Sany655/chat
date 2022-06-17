import io from "socket.io-client"

const url = "http://localhost:5000/";

const initialState = {
    socket:io.connect(url),
    url:url,
    fullHeight:0
}

function SocketReducer(state = initialState,action) {
    switch (action.type) {
        case "restart":
            state.socket.disconnect()
            return{
                ...state,
                socket:io.connect(url)
            }
        case "set_full_height":
            return {
                ...state,
                fullHeight:action.payload
            }
        default:return state;
    }
}

export default SocketReducer;