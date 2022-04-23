const express = require("express")
const app = express()
const cors = require("cors")
const { Server } = require("socket.io")
const socketIo = require("socket.io")
const http = require("http")
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["http://192.168.0.116:3000", "http://localhost:3000"]
        // methods: ["GET", "POST"]
    }
})

app.get('/', (req, res) => {
    res.send("hello world")
})

io.on("connection", (socket) => {
    io.allSockets().then(sockets => {
        const allSockets = Array.from(sockets);
        io.emit("allUsers", allSockets)
    })

    socket.on("callUser", (data) => {
        socket.to(data.id).emit("callUser", {...data,id:socket.id})
    })
    socket.on("sendingAnswer",(data) => {
        socket.to(data.id).emit("recievingingAnswer",{...data,id:socket.id})
    })







    socket.on("disconnect", () => {
        io.allSockets().then(sockets => {
            const allSockets = Array.from(sockets);
            io.emit("allUsers", allSockets)
        })
    })
})

server.listen(5000, () => {
    console.log("http://localhost:5000");
})