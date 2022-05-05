const initialState = {
    peoples:[],
    loading:false
}

function PeopleReducer(state = initialState,action) {
    switch (action.type) {
        case "get_peoples":
            return {
                ...state,
                peoples:action.payload
            }
            break;
    
        default:return state;
    }
}

export default PeopleReducer;