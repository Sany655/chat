import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function App() {
  const socket = useSelector(store => store.connection).socket
  const pc = useSelector(store => store.connection).pc
  const users = useSelector(store => store.connection).users
  const c = useSelector(store => store.connection).c
  const dispatch = useDispatch()
  const localStream = useRef()
  const mediaStream = useRef()
  const [errors, setErrors] = useState([])
  const dc = useRef()
  const [isChannelOpen, setIsChannelOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // socket
  }, [])


  useEffect(() => {
    socket.on("allUsers", (data) => {
      dispatch({ type: "setUsers", payload: data })
    })

  }, [])

  useEffect(() => {
    socket.on("disConnectedUser", () => {
      setIsChannelOpen(false)
      setMessages([])
      dispatch({ type: "restrartPc" })
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
    socket.on("callUser", data => {
      let localDescriptions;
      pc.onicecandidate = e => localDescriptions = pc.localDescription;
      pc.ondatachannel = e => {
        dc.current = e.channel;
        dc.current.onopen = () => {
          socket.emit("inCall", [socket.id, data.id]);
          setIsChannelOpen(true)
        };
      }
      pc.setRemoteDescription(data.offer).then(() => { })
      pc.createAnswer().then(answer => {
        pc.setLocalDescription(answer).then(() => { })
      })

      setTimeout(() => {
        socket.emit("sendingAnswer", {
          id: data.id,
          answer: localDescriptions
        })
      }, 1500)
    })

    return () => socket.removeListener("callUser")
  }, [pc])

  useEffect(() => {
    socket.on("recievingingAnswer", data => {
      pc.setRemoteDescription(data.answer).then(() => {

      })
    })

    return () => socket.removeListener("recievingingAnswer")
  }, [pc])

  const callUser = (id) => {
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

  if (loading) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 vw-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }
  return (
    <div className="container vh-100 py-5">
      {/* <div className="row">
        <div className="col-6 d-flex flex-column align-items-center justify-content-center  vh-100">
          <h3>Your socket id is {socket.id}</h3>
          <video ref={localStream} className="w-50 h-25 border" autoPlay={true}></video>
          <ul className="nav">
            {
              errors.map((error, i) => <li key={i} className="nav-item text-danger">{error}</li>)
            }
          </ul>
        </div>
        <div className="col-6 card"> */}
      {
        isChannelOpen ? (
          <>
            <div className="card-header">
              <i className="bi bi-x-lg" role={"button"} onClick={() => { window.location.reload() }}></i>
            </div>
            <div className="card h-100">
              {mediaStream.current && (
                <div className="card-body">
                  <video ref={mediaStream} className="w-50 h-25 border" autoPlay={true}></video>
                </div>
              )}
              <div className="card-body h-100">
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
          <ul className="list-group h-50">
            <h1>User List (sockets)</h1>
            {
              users.filter(u => u !== socket.id).map(user => (
                <li key={user} className="list-group-item d-flex justify-content-between align-items-center" role={"button"}>
                  <h5 className="m-0">{user}</h5>
                  <i className="bi bi-telephone fs-4" onClick={() => callUser(user)}></i>
                </li>
              ))
            }
          </ul>
        )
      }
      {/* </div>
      </div> */}
    </div>
  );
}

export default App;
