import axios from "axios";
import { combineReducers, createStore } from "redux";
import io from "socket.io-client";

let urls;
if ((window.location.hostname === 'localhost')||(window.location.hostname === '192.168.0.116')) {
    if (window.innerWidth < 720) {
        urls = "http://192.168.0.116:5000"
    } else {
        urls = "http://localhost:5000" // development
    }
} else {
    urls = "https://calling-dudes.herokuapp.com" // production
}
axios.defaults.baseURL = urls
const user = JSON.parse(localStorage.getItem("user"))

const initialState = {
    auth: localStorage.getItem("user") ? true : false,
    user: localStorage.getItem("user") ? user : {},
    socket: io.connect(urls),
    url: urls,
    activeChatUser: {},
    friends: [],
    peoples: [],
    callingFriends: false,
    peopleShow: false,
    // pc: new RTCPeerConnection(),
}

const Reducers = (state = initialState, action) => {
    switch (action.type) {
        case "LOGIN":
            localStorage.setItem("user", JSON.stringify(action.payload))
            return {
                ...state,
                auth: true,
                user: action.payload
            };
        case "LOGOUT":
            state.socket.disconnect()
            localStorage.removeItem("user")
            const socket = io.connect(urls)
            return {
                ...state,
                friends: [],
                peoples: [],
                auth: false,
                socket: socket,
                user: {}
            };
        case "SELECT_CHAT":
            return {
                ...state,
                activeChatUser: action.payload
            }
        case "DESELECT_CHAT":
            return {
                ...state,
                activeChatUser: {}
            }
        case "GET_FRIENDS":
            return {
                ...state,
                friends: action.payload
            }
        case "GET_PEOPLES":
            return {
                ...state,
                peoples: action.payload
            }
        case "TOGGLE_PEOPLE":
            return {
                ...state,
                peopleShow: !state.peopleShow
            }

        default: return state;
    }
}

const store = createStore(Reducers);

export default store;