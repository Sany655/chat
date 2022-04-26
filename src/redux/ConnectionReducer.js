import io from "socket.io-client";

const url = (window.location.hostname === 'localhost' || window.location.hostname === '192.168.0.116') ? (
    window.innerWidth > 720 ? "http://localhost:5000" : "http://192.168.0.116:5000"
) : "https://sany-webrtc.herokuapp.com";

const initialState = {
    socket:io(url),
    pc:new RTCPeerConnection(),
    // pc:new RTCPeerConnection({
    //     iceServers: [
    //         {
    //             urls: "stun:stun.stunprotocol.org"
    //         },
    //         {
    //             urls: 'turn:numb.viagenie.ca',
    //             credential: 'muazkh',
    //             username: 'webrtc@live.com'
    //         },
    //     ]
    // }), // this is the solution for different networks
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