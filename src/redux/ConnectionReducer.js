import io from "socket.io-client";

const url = "http://localhost:5000"

const initialState = {
    socket:io.connect(url),
    pc:new RTCPeerConnection(),
    url:url,
    users:[]
}

const ConnectionReducer = (state = initialState,action) => {
    switch (action.type) {
        case "setUsers":
            return {
                ...state,
                users: action.payload
            }
    
        default: return state;
    }
}

export default ConnectionReducer;