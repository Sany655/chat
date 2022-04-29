import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function App() {
    const socket = useSelector(store => store.connection).socket
    const pc = useSelector(store => store.connection).pc
    const users = useSelector(store => store.connection).users
    const dispatch = useDispatch()
    const localStream = useRef()
    const mediaStream = useRef()
    const [errors, setErrors] = useState([])
    const dc = useRef()
    const [isChannelOpen, setIsChannelOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [callType, setCallType] = useState(false)
    const [callingUser, setCallingUser] = useState([])

    function disconnectCall() {
        // window.location.reload();
        setIsChannelOpen(false)
        setLoading(false)

        localStream.current.srcObject && localStream.current.srcObject.getTracks().forEach(track => {
            track.stop()
        });
        mediaStream.current.srcObject && mediaStream.current.srcObject.getTracks().forEach(track => {
            track.stop()
        });

        dispatch({ type: "restartPc" })
        if (callingUser.length) {
            socket.emit("discardCall", callingUser)
        }
    }

    useEffect(() => {
        socket.on("allUsers", (data) => {
            dispatch({ type: "setUsers", payload: data })
        })
    }, [])

    useEffect(() => {
        socket.on("disConnectedUser", () => {
            // window.location.reload()
            disconnectCall()

        })
        socket.on("disconnect", () => {
            disconnectCall()
            // window.location.reload()
        })
    }, [])

    useEffect(() => {
        if (dc.current) {
            dc.current.onmessage = e => {
                setMessages([{
                    id: null,
                    message: e.data
                }, ...messages])
            };
        }
    }, [dc.current, messages])

    async function getTracks(type) {
        try {
            const stream = await window.navigator.mediaDevices.getUserMedia({ audio: true, video: type })
            stream.getTracks().forEach(track => {
                if (track.getConstraints().noiseSuppression) {
                    track.applyConstraints({ noiseSuppression: true })
                }
                pc.addTrack(track, stream)
            });
            setCallType(type)
            return stream;
        } catch (error) {
            throw "Your device doesn't support it";
        }
    }

    useEffect(() => {
        socket.on("callUser", async data => {
            if (isChannelOpen) {
                socket.emit("discardCall", [socket.id, data.id])
            } else {
                const perm = window.confirm("some one calling you.. recieve call?")
                if (perm) {
                    setCallingUser([socket.id, data.id])
                    setLoading(true)
                    getTracks(data.type).then((stream) => {
                        localStream.current.srcObject = stream
                        let localDescriptions;
                        pc.onicecandidate = e => localDescriptions = pc.localDescription;
                        pc.ondatachannel = e => {
                            dc.current = e.channel;
                            dc.current.onopen = () => {
                                socket.emit("inCall", [socket.id, data.id]);
                                setIsChannelOpen(true)
                                setLoading(false)
                            };
                        }
                        const remoteDesc = new RTCSessionDescription(data.offer)
                        pc.setRemoteDescription(remoteDesc).then(() => { })
                        pc.createAnswer().then(answer => {
                            pc.setLocalDescription(answer).then(() => { })
                        })

                        setTimeout(() => {
                            socket.emit("sendingAnswer", {
                                id: data.id,
                                answer: localDescriptions
                            })
                        }, 1500)
                    }).catch(err => {
                        setErrors([...errors, err])
                        socket.emit("discardCall", [socket.id, data.id])
                        setLoading(false)
                    })
                } else {
                    socket.emit("discardCall", [socket.id, data.id])
                }
            }
        })
        return () => socket.removeListener("callUser")
    }, [pc])

    useEffect(() => {
        socket.on("recievingingAnswer", data => {
            const remoteDesc = new RTCSessionDescription(data.answer);
            pc.setRemoteDescription(remoteDesc).then(() => {

            })
        })

        return () => socket.removeListener("recievingingAnswer")
    }, [pc])

    const callUser = async (id, type) => {
        setCallingUser([socket.id, id])
        setLoading(true)
        getTracks(type).then((stream) => {
            localStream.current.srcObject = stream
            let localDescriptions;

            dc.current = pc.createDataChannel("channel")
            dc.current.onopen = () => {
                setIsChannelOpen(true)
                socket.emit("inCall", [socket.id, id]);
                setLoading(false)
            };
            pc.onicecandidate = e => {
                localDescriptions = pc.localDescription
            };
            pc.createOffer().then(offer => {
                pc.setLocalDescription(offer).then(() => {

                })
            })

            setTimeout(() => {
                if (localDescriptions) {
                    socket.emit("callUser", {
                        id: id,
                        offer: localDescriptions,
                        type: type
                    })
                }
            }, 1500)
        }).catch(err => {
            setErrors([...errors, err])
            setLoading(false)
        })
    }

    useEffect(() => {
        let pc1 = pc;
        pc1.ontrack = e => {
            mediaStream.current.srcObject = e.streams[0];
        }
        return () => pc1 = null
    }, [pc])

    return (
        <div className="row m-0" style={{ height: "85vh" }}>
            <div className="d-none col-6 d-lg-flex flex-column align-items-center justify-content-center h-100">
                <h3>my id : {socket.id}</h3>
                <video ref={localStream} className={`w-100 ${!callType && "d-none"}`} autoPlay={true} muted controls></video>
                <ul className="nav">
                    {
                        errors.map((error, i) => <li key={i} className="nav-item text-danger">{error}</li>)
                    }
                </ul>
            </div>
            <div className="col-lg-6 col-12 h-100">
                <div className={`text-center h-50 ${!isChannelOpen && "d-none"}`}>
                    <ul className="nav">
                        {
                            errors.map((error, i) => <li key={i} className="nav-item text-danger">{error}</li>)
                        }
                    </ul>

                    <video ref={mediaStream} className={`w-100 ${!callType && "d-none"}`} style={{ height: "60%" }} autoPlay={true} controls></video>
                    <div className={`card ${callType && "d-none"}`}>
                        <div className="card-body text-center">
                            <h1>Call ongoing</h1>
                        </div>
                    </div>
                    <button className="btn btn-danger" onClick={disconnectCall}>
                        Cancel call
                        <i className="bi bi-x-lg ms-2"></i>
                    </button>
                </div>
                {
                    isChannelOpen ? (
                        <>
                            <div className="card h-50">
                                <div className="card-body d-flex justify-content-between align-items-center flex-column">
                                    <ul className="list-group overflow-auto">
                                        {
                                            messages.map((message, i) => (
                                                message.id === socket.id ? (
                                                    <li className="list-group-item bg-primary text-light" key={i}>{message.message}</li>
                                                ) : (
                                                    <li className="list-group-item" key={i}>{message.message}</li>
                                                )
                                            ))
                                        }
                                    </ul>
                                    <form className="w-100" onSubmit={e => {
                                        e.preventDefault()
                                        dc.current.send(e.target.msg.value)
                                        setMessages([{ id: socket.id, message: e.target.msg.value }, ...messages])
                                        e.target.msg.value = ""
                                    }}>
                                        <div className="input-group">
                                            <input type="text" className="form-control" name="msg" autoComplete="off" />
                                            <button className="input-group-text" type="submit">
                                                <i className="bi bi-send"></i>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </>
                    ) : (
                        loading ? (
                            <div className="d-flex align-items-center justify-content-center h-100">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : <ul className="list-group h-100 overflow-auto">
                            <h1>User List ({socket.id})</h1>
                            {
                                users.filter(u => u !== socket.id).map(user => (
                                    <li key={user} className="list-group-item d-flex justify-content-between align-items-center">
                                        <h5 className="m-0">{user}</h5>
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="bi bi-telephone fs-4" onClick={() => {
                                                callUser(user, false)
                                            }} role={"button"}></i>
                                            <i className="bi bi-camera-video fs-4" onClick={() => {
                                                callUser(user, true)
                                            }} role={"button"}></i>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    )
                }
            </div>
        </div>
    );
}

export default App;
