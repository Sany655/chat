const express = require("express")
const dotenv = require("dotenv")
const http = require("http")
const { Server } = require("socket.io")
const { MongoClient, ServerApiVersion } = require("mongodb")
const multer = require("multer")
// const fs = require('fs')
const cors = require("cors")
let socket;
const app = express()
const server = http.createServer(app)
dotenv.config()
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
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

async function database() {
    try {
        await client.connect();
        const db = client.db(process.env.DB_NAME);
        const chat = db.collection("chat");
        const users = db.collection("users");

        app.post("/email", (req, res) => {
            console.log(req.body);
            users.findOne({ email: req.body.email }).then(emailRes => {
                console.log(emailRes);
                if (emailRes) {
                    console.log("true");
                    res.send("true")
                } else {
                    console.log("false");
                    res.send("false")
                }
            }).catch(err => console.log(err.message))
        })

        app.post("/registration",
            upload.single("image"),
            (req, res) => {
                req.body.image = req.file.filename;
                users.insertOne(req.body).then(insertRes => {
                    if (insertRes.acknowledged) {
                        res.send("done");
                    } else {
                        res.send(insertRes)
                    }
                }).catch(err => res.send(err.message))
            }
        )

        app.post("/login", (req, res) => {
            users.findOne(req.body).then(loginResponse => {
                res.send(loginResponse);
            }).catch(err => res.send(err.message))
        })

        console.log("mongo connected");
    } catch (error) {
        console.log(error.message);
    }
}

database();

app.get("/", (req, res) => {
    res.send("Hello world")
})

io.on("connection", (socket) => {
    socket = socket;
    console.log(socket.id);


    socket.on("disconnect", () => {
        console.log(socket.id + " is disconnected");
    })
})

server.listen(process.env.PORT, () => {
    console.log("http://localhost:5000")
})