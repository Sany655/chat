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

    useEffect(() => {
        socket.on("allUsers", (data) => {
            dispatch({ type: "setUsers", payload: data })
        })
    }, [])

    useEffect(() => {
        socket.on("disConnectedUser", () => {
            window.location.reload()
        })
        socket.on("disconnect", () => {
            window.location.reload()
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

    useEffect(() => {
        socket.on("callUser", async data => {
            const perm = window.confirm("some one calling you.. recieve call?")
            if (perm) {
                let stream;
                try {
                    stream = await window.navigator.mediaDevices.getUserMedia({ audio: true, video: true })
                } catch (error) {
                    console.log(error.message);
                    stream = await window.navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
                }
                localStream.current.srcObject = stream;
                stream.getTracks().forEach(track => pc.addTrack(track, stream));
                let localDescriptions;
                pc.onicecandidate = e => localDescriptions = pc.localDescription;
                pc.ondatachannel = e => {
                    dc.current = e.channel;
                    dc.current.onopen = () => {
                        socket.emit("inCall", [socket.id, data.id]);
                        setIsChannelOpen(true)
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
            } else {
                socket.emit("discardCall", [socket.id, data.id])
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

    const callUser = async (id) => {
        let stream;
        try {
            stream = await window.navigator.mediaDevices.getUserMedia({ audio: true, video: true })
        } catch (error) {
            stream = await window.navigator.mediaDevices.getDisplayMedia({ audio: true, video: true })
        }
        localStream.current.srcObject = stream;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));
        setLoading(true)
        let localDescriptions;

        dc.current = pc.createDataChannel("channel")
        dc.current.onopen = () => {
            setLoading(false)
            setIsChannelOpen(true)
            socket.emit("inCall", [socket.id, id]);
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
                    offer: localDescriptions
                })
            }
        }, 1500)
    }

    useEffect(() => {
        let pc1 = pc;
        pc1.ontrack = e => {
            mediaStream.current.srcObject = e.streams[0];
        }

        return () => pc1 = null
    }, [pc])

    return (
        <div className="row m-0 vh-100">
            <div className="d-none d-lg-block col-6 d-flex flex-column align-items-center justify-content-center h-100">
                <h3>Your socket id is {socket.id}</h3>
                <video ref={localStream} className="w-100 h-75 border" autoPlay={true} muted></video>
                <ul className="nav">
                    {
                        errors.map((error, i) => <li key={i} className="nav-item text-danger">{error}</li>)
                    }
                </ul>
            </div>
            <div className="col-lg-6 col-12 h-100">
                <div className={`card-body text-center h-50 ${!isChannelOpen&&"d-none"}`}>
                    <ul className="nav">
                        {
                            errors.map((error, i) => <li key={i} className="nav-item text-danger">{error}</li>)
                        }
                    </ul>
                    <video ref={mediaStream} className={`w-100 h-100 border`} autoPlay={true} controls></video>
                </div>
                {
                    isChannelOpen ? (
                        <>
                            <div className="card h-50">
                                <div className="card-header">
                                    <i className="bi bi-x-lg" role={"button"} onClick={() => { window.location.reload() }}></i>
                                </div>
                                <div className="card-body h-75">
                                    <ul className="list-group overflow-auto" style={{ height: "90%" }}>
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
                                    <form style={{ height: "10%" }} onSubmit={e => {
                                        e.preventDefault()
                                        dc.current.send(e.target.msg.value)
                                        setMessages([{ id: socket.id, message: e.target.msg.value }, ...messages])
                                        e.target.msg.value = ""
                                    }}>
                                        <div className="input-group">
                                            <input type="text" className="form-control" name="msg" />
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
                            <h1>User List (sockets)</h1>
                            {
                                users.filter(u => u !== socket.id).map(user => (
                                    <li key={user} className="list-group-item d-flex justify-content-between align-items-center">
                                        <h5 className="m-0">{user}</h5>
                                        <i className="bi bi-telephone fs-4" onClick={() => {
                                            callUser(user)
                                        }} role={"button"}></i>
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
