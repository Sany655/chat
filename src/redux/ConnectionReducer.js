import io from "socket.io-client";

const url = (window.location.hostname === 'localhost' || window.location.hostname === '192.168.0.116') ? (
    window.innerWidth > 720 ? "http://localhost:5000" : "http://192.168.0.116:5000"
) : "https://sany-webrtc.herokuapp.com";

const initialState = {
    socket:io(url),
    pc:new RTCPeerConnection({
        iceServers: [
            {
                urls: 'stun:numb.viagenie.ca',
                credential: '@TnaWcnWVWu4QRn',
                username: 'mazharulalam26@gmail.com'
            },
            {
                urls: 'turn:numb.viagenie.ca',
                credential: '@TnaWcnWVWu4QRn',
                username: 'mazharulalam26@gmail.com'
            },
        ]
    }), // this is the solution for different networks
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
        case "restartPc":
            state.pc.close();
            return {
                ...state,
                pc:new RTCPeerConnection()
            }
        default: return state;
    }
}

export default ConnectionReducer;