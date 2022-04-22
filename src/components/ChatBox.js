import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ChatBox = () => {
    const dispatch = useDispatch()
    const activeChatUser = useSelector(store => store.activeChatUser);
    const pc = useSelector(store => store.pc);
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
            socket.emit("get_user", frndId, (data) => {
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

    function deleteFriend() {
        const con = window.confirm("are you sure to delete this friend and it's conversation")
        if (con) {
            activeChatUser.friend = chatUser;
            activeChatUser.user = user;
            socket.emit("delete_frnd_conv", activeChatUser, (data) => {
                alert(data)
            })
        }
    }


    // async function startingCall() {
    //     navigator.mediaDevices.getUserMedia({video:true,audio:true}).then(stream => {
    //         console.log(stream);
    //     }).catch(err => err.message).finally(() => {console.log("call finally")})
    //     const dc = pc.createDataChannel("audio_call")
    //     dc.onopen = e => console.log("data channel opened")
    //     dc.onmessage = e => console.log("onmessage " + e.data)
    //     pc.createOffer().then(offer => {
    //         pc.setLocalDescription(offer)
    //     })
    //     let i = 0;
    //     pc.onicecandidate = () => {
    //         if (i === 0) {
    //             socket.emit("call_user", {
    //                 from: { socket: socket.id, name: user.name },
    //                 to: { socket: chatUser.socket, name: chatUser.name },
    //                 dataSignal: pc.localDescription
    //             })
    //         }
    //         i++;
    //     }
    // }

    // useEffect(() => {
    //     // const pc = new RTCPeerConnection();
    //     socket.on("call_ringing", async (data) => {
    //         const answeringCall = window.confirm(data.from.name + " calling you, would u want to take it?")
    //         if (answeringCall) {
    //             pc.onicecandidate = () => {
    //                 // console.log("onicecandidate" + JSON.stringify(pc.localDescription))
    //                 socket.emit("call_ringing", { ...data, dataSignal: pc.localDescription })
    //             };
    //             pc.setRemoteDescription(data.dataSignal).then(() => {

    //             }).catch(err => console.log(err.message))
    //             pc.ondatachannel = e => {
    //                 e.channel.onopen = () => console.log("data channel opened");
    //                 e.channel.onmessage = dcData => console.log("on message ", dcData.data); // comming message
    //             }
    //             const answer = await pc.createAnswer()
    //             pc.setLocalDescription(answer)
    //         }
    //     })
    //     socket.on("call_recieving_again", (data) => {
    //         pc.setRemoteDescription(data.dataSignal)
    //     })
    // }, [])

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
                                        <h5><Link className='text-decoration-none' to={'/profile/' + chatUser._id}>{chatUser.name}</Link></h5>
                                    </div>
                                </>
                            ) : null
                        }
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {Object.keys(activeChatUser).length ? (
                            <>
                                {/* <i className="bi bi-telephone fs-4" onClick={startingCall} role={"button"}></i> */}
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
                        <div className="dropdown">
                            <button className="btn" style={{ outline: "none", boxShadow: "none" }} type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" disabled={Object.keys(activeChatUser).length ? false : true}>
                                &#128512;
                            </button>
                            <div className="dropdown-menu p-0" onClick={e => e.stopPropagation()}>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128512;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128513;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128514;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128515;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128516;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128517;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128518;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128519;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128520;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128521;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128522;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128523;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128524;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128525;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128526;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128527;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128528;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128529;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128530;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128531;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128532;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128533;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128534;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128535;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128536;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128537;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128538;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128539;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128540;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128541;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128542;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128543;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128544;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128545;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128546;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128547;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128548;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128549;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128550;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128551;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128552;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128553;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128554;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128555;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128556;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128557;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128558;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128559;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128560;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128561;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128562;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128563;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128564;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128565;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128566;</small>
                                <small role="button" className="" onClick={(e) => setMsg(msg + e.currentTarget.textContent)}>&#128567;</small>
                            </div>
                        </div>
                        <button disabled={msg ? false : true} type="submit" className="btn btn-primary">
                            <i className="bi bi-send"></i>
                        </button>
                    </div>
                </form>
            </div >
        </div >
    )
}

export default ChatBox