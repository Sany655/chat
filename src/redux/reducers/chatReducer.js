const initialState = {
    chatUser: {},
    isSelectedChatUser: false,
    mobile:navigator.userAgentData.mobile
}

function ChatReducer(state = initialState, action) {
    switch (action.type) {
        case "select_chat":
            return {
                ...state,
                chatUser: action.payload,
                isSelectedChatUser: true,
            }
        case "deselect_chat":
            return {
                ...state,
                chatUser: {},
                isSelectedChatUser: false
            }
        default:return state;
    }
}

export default ChatReducer;