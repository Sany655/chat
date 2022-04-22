const express = require("express")
const app = express()
const cors = require("cors")
const { Server } = require("socket.io")
const http = require("http")
app.use(cors())
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: ["http://192.168.0.116:3000", "http://localhost:3000"]
        // methods: ["GET", "POST"]
    }
})

app.get('/',(req,res) => {
    res.send("hello world")
})

io.on("connection", () => {
    
})

app.listen(5000,() => {
    console.log("http://localhost:5000");
})