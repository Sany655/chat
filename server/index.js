const express = require("express")
const app = express()
require("dotenv").config()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")

const io = new Server(server,{
    cors:{
        origin:["http://localhost:3000"]
    }
})

io.on("connection", socket => {
    console.log(socket.id+" is connected");



    io.on("disconnect", () => {
        console.log(socket.id+" is disconnected");
    })
})

server.listen(process.env.PORT,() => {
    console.log("http://localhost:"+process.env.PORT);
})