import { combineReducers, createStore } from "redux";
import ConnectionReducer from "./redux/ConnectionReducer";

const reducers = combineReducers({
    connection:ConnectionReducer,
})

export default createStore(reducers)