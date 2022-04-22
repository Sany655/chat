const initialState = {
    count:0
}

const CallReducer = (state = initialState,action) => {
    switch (action.type) {
        case "plus":
            return {
                ...state,
                count: state.count+1
            }
    
        default: return state;
    }
}

export default CallReducer;