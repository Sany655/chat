import axios from "axios";
import { createStore } from "redux";
import io from "socket.io-client";

const urls = "https://calling-dudes.herokuapp.com/" // production
// const urls = "http://localhost:5000" // development

axios.defaults.baseURL = urls

const initialState = {
    auth: localStorage.getItem("user") ? true : false,
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {},
    socket: io.connect(urls)
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