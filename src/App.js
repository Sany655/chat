import { useCallback, useEffect, useRef, useState } from "react";
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

  useEffect(() => {
    socket.on("allUsers", (data) => {
      dispatch({ type: "setUsers", payload: data })
    })
  }, [])

  useEffect(() => {
    socket.on("callUser", data => {
      // window.navigator.mediaDevices.getDisplayMedia({ audio: true, video: true }).then(stream => {
      //   mediaStream.current.srcObject = stream
        let localDescriptions;
        pc.onicecandidate = e => localDescriptions = pc.localDescription;
        pc.ondatachannel = e => {
          dc.current = e.channel;
          dc.current.onmessage = e => console.log("the message" + e.data) & setMessages([e.data, ...messages]);
          dc.current.onopen = () => console.log("channe opend") & setIsChannelOpen(true);
          // pc.addStream(stream)
          // pc.onaddstream = (e) => mediaStream.current.srcObject = e.stream;
        }
        pc.setRemoteDescription(data.offer).then(() => console.log("offer set"))
        pc.createAnswer().then(answer => {
          pc.setLocalDescription(answer).then(() => {
            console.log("set local desc ans");
          })
        })

        setTimeout(() => {
          socket.emit("sendingAnswer", {
            id: data.id,
            answer: localDescriptions
          })
        }, 1500)
      // }).catch(err => setErrors([...errors, err.message]))
    })
  }, [])

  useEffect(() => {
    socket.on("recievingingAnswer", data => {
      console.log(data.answer);
      pc.setRemoteDescription(data.answer).then(() => {
        console.log("set answer to remote decripiton");
      })
    })
  }, [])

  const callUser = (id) => {
    // window.navigator.mediaDevices.getDisplayMedia({ audio: true, video: true }).then(stream => {
    //   localStream.current.srcObject = stream;
      let localDescriptions;
      dc.current = pc.createDataChannel("channel")
      dc.current.onmessage = e => console.log("the message" + e.data) & setMessages([e.data, ...messages]);
      dc.current.onopen = () => console.log("channe opend") & setIsChannelOpen(true);
      // pc.addStream(stream)
      // pc.onaddstream = (e) => mediaStream.current.srcObject = e.stream;
      pc.onicecandidate = e => {
        localDescriptions = pc.localDescription
        console.log(pc.localDescription);
      };
      pc.createOffer().then(offer => {
        pc.setLocalDescription(offer).then(() => {
          console.log("set local desc offer");
        })
      })

      setTimeout(() => {
        console.log(localDescriptions);
        if (localDescriptions) {
          socket.emit("callUser", {
            id: id,
            offer: localDescriptions
          })
        }
      }, 1500)

    // }).catch(err => setErrors([...errors, err.message]))
  }

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-6 d-flex flex-column align-items-center justify-content-center  vh-100">
          <h3>Your socket id is {socket.id}</h3>
          <video ref={localStream} className="w-50 h-25 border" autoPlay={true}></video>
          <ul className="nav">
            {
              errors.map((error, i) => <li key={i} className="nav-item text-danger">{error}</li>)
            }
          </ul>
        </div>
        <div className="col-6">
          <div className="card">
            <div className="card-body">
              {mediaStream.current && (
                <video ref={mediaStream} className="w-50 h-25 border" autoPlay={true}></video>
              )}
            </div>
          </div>
          {
            !isChannelOpen ? (
              <ul className="list-group">
                {
                  users.filter(u => u !== socket.id).map(user => (
                    <li key={user} className="list-group-item d-flex justify-content-between align-items-center" role={"button"}>
                      <h5 className="m-0">{user}</h5>
                      <i className="bi bi-telephone fs-4" onClick={() => callUser(user)}></i>
                    </li>
                  ))
                }
              </ul>
            ) : (
              <div className="card">
                <div className="card-body">
                  <ul className="list-group">
                    {
                      messages.map((message, i) => (
                        <li className="list-group-item" key={i}>{message}</li>
                      ))
                    }
                  </ul>
                  <form onSubmit={e => {
                    e.preventDefault()
                    dc.current.send(e.target.msg.value)
                    e.target.msg.value = ""
                  }}>
                    <div className="input-group">
                      <input type="text" className="form-control" name="msg" />
                      <span className="input-group-text" role={"button"} type="submit">
                        <i className="bi bi-send"></i>
                      </span>
                    </div>
                  </form>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default App;
