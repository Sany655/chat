const express = require("express")
const app = express()
const cors = require("cors")
const io = require("socket.io")

app.use(cors())

app.get('/',(req,res) => {
    res.send("hello world")
})

// io.Server({})

app.listen(5000,() => {
    console.log("http://localhost:5000");
})