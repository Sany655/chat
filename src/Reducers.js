import { combineReducers, createStore } from "redux";
import CallReducer from "./redux/CallReducer";

const reducers = combineReducers({
    call:CallReducer
})

export default createStore(reducers)