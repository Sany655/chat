const express = require("express")
const app = express()
require("dotenv").config()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const { MongoClient, ServerApiVersion } = require('mongodb');
const fs = require("fs")

app.use(express.static(__dirname + '/images'))

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"]
    }
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e2cer.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const db = client.db("calling_dudes");
    const users = db.collection("users");


    io.on("connection", socket => {
        console.log(socket.id + " is connected");

        socket.on("unique-email", (data, cb) => {
            users.findOne({ email: data.email }).then(emailRes => {
                if (emailRes) {
                    cb(true)
                } else {
                    cb(false)
                }
            }).catch(err => console.log(err.message))
        })

        // socket.on("register",data => {
        //     fs.createWriteStream("./images/"+data.imageName).write(data.image);
        // })



        socket.on("disconnect", () => {
            console.log(socket.id + " is disconnected");
        })
    })



    console.log("DB connected");
    // client.close();
});



server.listen(process.env.PORT, () => {
    console.log("http://localhost:" + process.env.PORT);
})