import { combineReducers, createStore } from "redux";
import ChatReducer from "./reducers/chatReducer";
import FriendsReducer from "./reducers/friendReducer";
import PeopleReducer from "./reducers/peopleReducer";
import SocketReducer from "./reducers/socketReducer";
import UserReducer from "./reducers/userReducer";

export default createStore(combineReducers({
    socket: SocketReducer,
    user: UserReducer,
    chat:ChatReducer,
    peoples:PeopleReducer,
    friends:FriendsReducer
}))