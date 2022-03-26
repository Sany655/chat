import axios from "axios";
import { createStore } from "redux";
import io from "socket.io-client";

axios.defaults.baseURL = "http://localhost:5000"
// axios.defaults.baseURL = "https://calling-dudes.herokuapp.com/"

const initialState = {
    auth: localStorage.getItem("user") ? true : false,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
    socket: io.connect("http://localhost:5000")
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
            localStorage.removeItem("user")
            return {
                ...state,
                auth: false,
                user: {}
            };

        default: return state;
    }
}

const store = createStore(Reducers);

export default store;