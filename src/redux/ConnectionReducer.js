import io from "socket.io-client";

const url = (window.location.hostname === 'localhost') ? "http://localhost:5000" : "https://sany-webrtc.herokuapp.com";
console.log(url);
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