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
client.connect().then(() => {
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

        socket.on("register", (data, cb) => {
            const image = data.image;
            data.image = data.imageName;
            delete data.imageName;
            users.insertOne(data).then(insertRes => {
                if (insertRes.acknowledged) {
                    cb("done");
                    fs.createWriteStream("./images/" + data.image).write(image);
                } else {
                    cb(insertRes)
                }
            }).catch(err => res.send(err.message))
        })

        socket.on("login", (data, cb) => {
            users.findOneAndUpdate({email:data.email,password:data.password}, { $set: { active: true, socket: socket.id } }).then(loginResponse => {
                loginResponse.value.active = true;
                loginResponse.value.socekt = socket.id;
                cb(loginResponse);
            }).catch(err => cb(err.message))
        })

        socket.on("disconnect", () => {
            users.findOneAndUpdate({ socket: socket.id }, { $set: { active: false, socket: null,lastActive:Date.now() } }).then((res) => {
                if (res.lastErrorObject.updatedExisting) {
                    // socket.broadcast.emit("loggedOn", res.value._id)
                }
            }).catch(err => console.log(err.message))
            console.log(socket.id+" disconnect");
        })
    })



    console.log("DB connected");
}).catch(err => console.log(err.message));



server.listen(process.env.PORT, () => {
    console.log("http://localhost:" + process.env.PORT);
})