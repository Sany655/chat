const initialState = {
    friends:[],
    loading:true,
    load:false
}

function FriendsReducer(state = initialState,action) {
    switch (action.type) {
        case "get_friends":
            return {
                ...state,
                friends:action.payload,
                loading:false
            }
            break;
    
        default:return state;
    }
}

export default FriendsReducer