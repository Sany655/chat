import { combineReducers, createStore } from "redux";
import SocketReducer from "./reducers/socketReducer";
import UserReducer from "./reducers/userReducer";

export default createStore(combineReducers({
    socket: SocketReducer,
    user: UserReducer
}))