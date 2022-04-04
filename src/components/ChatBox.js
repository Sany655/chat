import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

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

    socket.on("message_sent", () => {
        setIncommingMessage(true)
    })

    useEffect(() => {
        if (activeChatUser) {
            const frndId = activeChatUser.users.find(f => f !== user._id);
            socket.emit("get_friend", frndId, (data) => {
                setChatUser(data)
                setLoggedOn(false)
            })
        }
    }, [activeChatUser, loggedOn])

    const sentMesssage = (e) => {
        e.preventDefault()
        if (msg) {
            socket.emit("sentMessage", { id: activeChatUser._id, sender: user._id, reciever: chatUser._id, message: msg }, (data) => {
                if (data === "done") {
                    setMsg("")
                }
            })
        }
    }

    return (
        <div className="col-12 col-lg-6">
            <div className="card" style={{ height: "90vh" }}>
                <div className="card-header d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center gap-4">
                        <div className="d-lg-none"><Link to={'/friends'}><svg style={{ width: "30px", height: "30px" }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left-circle" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z" />
                        </svg></Link></div>
                        {
                            activeChatUser ? (
                                <>
                                    <img src={url + "/images/" + chatUser.image} alt="" className="rounded-circle" width={65} height={65} />
                                    <div className="">
                                        <h5>{chatUser.name}</h5>
                                    </div>
                                </>
                            ) : null
                        }
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {activeChatUser ? (
                            chatUser.active ? <p className="rounded-circle bg-success m-0" style={{ width: "15px", height: "15px" }}></p> : <p className="rounded-circle m-0" style={{ width: "15px", height: "15px", background: "#e0e0e0" }}></p>
                        ) : null}
                        <Link to={'/peoples'} className="d-lg-none">
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16">
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path fillRule="evenodd" d="M5.216 14A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216z" />
                                <path d="M4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                            </svg>
                        </Link>
                        <a href="#" title='logout' onClick={() => dispatch({ type: "LOGOUT" })}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-box-arrow-right" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
                                <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
                            </svg>
                        </a>
                    </div>
                </div>
                <div className="card-body overflow-auto" ref={chatBody}>
                    {activeChatUser ? (
                        chatMessages.length > 0 ? (

                            chatMessages.map(message => (
                                message.sender === user._id ? (
                                    <p className="bg-primary text-light p-2 rounded text-end">{message.message}</p>
                                ) : (
                                    <p className="bg-light text-dark p-2 rounded">{message.message}</p>
                                )
                            ))
                        ) : (
                            <p className="d-flex justify-content-center align-items-center h-100">Say hi to your friend</p>
                        )
                        // <>
                        //     <p className="bg-primary text-light p-2 rounded text-end">Lorem ipsum, dolor sit ame</p>
                        //     <p className="bg-light text-dark p-2 rounded">Lorem ipsum, dolor sit</p>
                        //     <p className="bg-primary text-light p-2 rounded text-end">Lorem ipsum, dolor sit ame</p>
                        //     <p className="bg-light text-dark p-2 rounded">Lorem ipsum, dolor sit</p>
                        // </>
                    ) : (
                        <div className='d-flex justify-content-center align-items-center h-100'>Chose a friend to chat</div>
                    )}
                </div>
                <form onSubmit={sentMesssage}>
                    <div className="card-footer d-flex align-items-center gap-2">
                        <input required type="text" className="form-control" placeholder='write message' value={msg} onChange={(e) => setMsg(e.target.value)} disabled={activeChatUser ? false : true} />
                        <button disabled={msg ? false : true} type="submit" className="btn btn-primary"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                            <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                        </svg></button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default ChatBox