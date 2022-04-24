import io from "socket.io-client";

const url = (window.location.hostname === 'localhost') ? "http://localhost:5000" : "https://sany-webrtc.herokuapp.com";

const initialState = {
    socket:io(url),
    pc:new RTCPeerConnection(),
    url:url,
    users:[],
}

const ConnectionReducer = (state = initialState,action) => {
    switch (action.type) {
        case "setUsers":
            return {
                ...state,
                users: action.payload
            }
        case "restrartPc":
            state.pc.close();
            return {
                ...state,
                pc:new RTCPeerConnection()
            }
        default: return state;
    }
}

export default ConnectionReducer;