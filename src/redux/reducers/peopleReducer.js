const initialState = {
    peoples:[],
    loading:true
}

function PeopleReducer(state = initialState,action) {
    switch (action.type) {
        case "get_peoples":
            return {
                ...state,
                peoples:action.payload,
                loading:false
            }
            break;
    
        default:return state;
    }
}

export default PeopleReducer;