const express = require("express")
const app = express()
const { Server } = require("socket.io")
const http = require("http")
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://sany-calling.web.app", "http://192.168.0.116:3000"]
    }
})

app.use(express.json())

app.get('/', (req, res) => {
    res.send("hello world")
})

io.on("connection", (socket) => {

    io.allSockets().then(sockets => {
        const allSockets = Array.from(sockets);
        io.emit("allUsers", allSockets)
    })

    socket.on("callUser", (data) => {
        socket.to(data.id).emit("callUser", { ...data, id: socket.id })
    })
    socket.on("sendingAnswer", (data) => {
        socket.to(data.id).emit("recievingingAnswer", { ...data, id: socket.id })
    })

    let ids = [];
    socket.on("inCall", (data) => {
        ids = data
    })

    socket.on("discardCall",(data) => {
        io.to(data[1]).disconnectSockets()
    })

    socket.on("disconnect", () => {
        io.allSockets().then(sockets => {
            const allSockets = Array.from(sockets);
            io.emit("allUsers", allSockets)
        })
        if (ids.length) {
            io.to(ids.find(id => socket.id !== id)).emit("disConnectedUser")
        }
    })
})

const port = process.env.PORT ? process.env.PORT : "5000"

server.listen(port, () => {
    console.log("http://localhost:" + port);
})