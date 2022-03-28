const express = require("express")
require("dotenv").config()
const http = require("http")
const { Server } = require("socket.io")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")
const multer = require("multer")
const fs = require('fs')
const cors = require("cors")
const app = express()
const server = http.createServer(app)
app.use('/images', express.static(__dirname + '/images'));
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // development mode
        // origin: "https://calling-dudes.web.app", // production mode
        // methods: ["GET", "POST"]
    }
})
const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, __dirname + '/images')
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniqueSuffix + "-" + file.originalname)
        }
    })
})
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e2cer.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const register = require("./controllers/register")
const login = require("./controllers/login")
const peoples = require("./controllers/peoples")
const connect_people = require("./controllers/connect_people")
const get_friends = require("./controllers/get_friends")
const get_friend = require("./controllers/get_friend")
const email = require("./controllers/email")
const logout = require("./controllers/logout")

app.get("/", (req, res) => {
    res.send("Hello world")
})

async function database() {
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const friends = db.collection("friends");
        const chat = db.collection("chat");
        const users = db.collection("users");

        app.post("/email", email(users))
        app.post("/registration", upload.single("image"), register(users))
        app.post("/login", login(users))
        app.post("/logout", logout(users))
        app.post("/peoples", peoples(users))
        app.post("/connect_people", connect_people(friends))
        app.get("/get_friends", get_friends(friends))
        app.get("/get_friend", get_friend(users))

        io.on("connection", async (socket) => {
            console.log(socket.id + " is connected");

            socket.on("registered", () => {
                socket.broadcast.emit("newUserFound");
            })
            socket.on("new_friend_added", () => {
                socket.emit("new_friend_added")
            })
            socket.on("loggedIn", (_id) => {
                socket.broadcast.emit("loggedOn", _id)
            })

            socket.on("disconnect", () => {
                console.log(socket.id + " is disconnected");
            })
        })

        console.log("mongo connected");
    } catch (error) {
        console.log(error.message);
    }
}

database();

server.listen(process.env.PORT, () => {
    console.log("http://localhost:" + process.env.PORT)
})