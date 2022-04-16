import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const ChatBox = () => {
    const dispatch = useDispatch()
    const activeChatUser = useSelector(store => store.activeChatUser);
    const socket = useSelector(store => store.socket);
    const user = useSelector(store => store.user);
    const url = useSelector(store => store.url);
    const [chatUser, setChatUser] = useState({})
    const [chatMessages, setChatMessages] = useState([])
    const [loggedOn, setLoggedOn] = useState(false)
    const [incommingMessage, setIncommingMessage] = useState(false)
    const [msg, setMsg] = useState("")
    const chatBody = useRef()

    useEffect(() => {
        socket.on("loggedOn", (data) => {
            if (data === chatUser._id) {
                setLoggedOn(true)
            }
        })
    }, [chatUser])

    useEffect(async () => {
        if (activeChatUser) {
            socket.emit("getChat", { _id: activeChatUser._id }, data => {
                setChatMessages(data.chat)
                setIncommingMessage(false)
                if (chatBody.current !== null) {
                    chatBody.current.scrollTop = chatBody.current.scrollHeight
                }
            })
        }
    }, [activeChatUser, incommingMessage])

    useEffect(() => {
        socket.on("message_sent", (data) => {
            setIncommingMessage(true)
        })
    }, [])

    useEffect(() => {
        if (Object.keys(activeChatUser).length) {
            const frndId = activeChatUser.users.find(f => f !== user._id);
            socket.emit("get_friend", frndId, (data) => {
                setChatUser(data)
                setLoggedOn(false)
            })
        }
    }, [activeChatUser, loggedOn])

    const sentMesssage = (e) => {
        e.preventDefault()
        if (msg && Object.keys(activeChatUser).length) {
            socket.emit("sentMessage", { id: activeChatUser._id, sender: user._id, reciever: chatUser._id, message: msg }, (data) => {
                if (data === "done") {
                    setMsg("")
                }
            })
        }
    }

    async function startingCall(e) {
        // navigator.mediaDevices.getUserMedia({audio:true,video:false}).then(res => {
        //     console.log(res);
        // }).catch(err => console.log(err.message))
        // const screen = await navigator.mediaDevices.getDisplayMedia()
        // console.log(devices);
    }

    function deleteFriend() {
        const con = window.confirm("are you sure to delete this friend and it's conversation")
        if (con) {
            activeChatUser.friend = chatUser;
            socket.emit("delete_frnd_conv", activeChatUser, (data) => {
                alert(data)
            })
        }
    }

    return (
        <div className="col-lg-6 col-12">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-lg-none">
                            <a href="#" onClick={() => dispatch({ type: "DESELECT_CHAT" })}>
                                <i className="bi bi-arrow-left-circle fs-4"></i>
                            </a>
                        </div>
                        {
                            Object.keys(activeChatUser).length ? (
                                <>
                                    <img src={chatUser.image && url + "/images/" + chatUser.image} alt="" className="rounded-circle" width={65} height={65} />
                                    <div className="">
                                        <h5>{chatUser.name}</h5>
                                    </div>
                                </>
                            ) : null
                        }
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {Object.keys(activeChatUser).length ? (
                            <>
                                <button className="btn btn-sm btn-primary" onClick={startingCall}>call</button>
                                {
                                    chatUser.active ? <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p> : <p className="rounded-circle m-0" style={{ width: "15px", height: "15px", background: "#e0e0e0" }}></p>
                                }
                                <a href="#" onClick={deleteFriend}>
                                    <i role="button" className="bi bi-person-x-fill fs-4" ></i>
                                </a>
                            </>
                        ) : null}
                    </div>
                </div>
                <div className="card-body overflow-auto" ref={chatBody}>
                    {Object.keys(activeChatUser).length ? (
                        chatMessages.length > 0 ? (

                            chatMessages.map(message => (
                                message.sender === user._id ? (
                                    <p key={message._id} className="bg-primary text-light p-2 rounded text-end">{message.message}</p>
                                ) : (
                                    <p key={message._id} className="bg-light text-dark p-2 rounded">{message.message}</p>
                                )
                            ))
                        ) : (
                            <p className="d-flex justify-content-center align-items-center h-100">Say hi to your friend</p>
                        )
                    ) : (
                        <div className='d-flex justify-content-center align-items-center h-100'>Chose a friend to chat</div>
                    )}
                </div>
                <form onSubmit={sentMesssage}>
                    <div className="card-footer d-flex align-items-center gap-2">
                        <input required type="text" className="form-control" placeholder='write message' value={msg} onChange={(e) => setMsg(e.target.value)} disabled={Object.keys(activeChatUser).length ? false : true} />
                        <button disabled={msg ? false : true} type="submit" className="btn btn-primary">
                            <i className="bi bi-send"></i>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChatBox