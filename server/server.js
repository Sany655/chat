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
        // origin: "http://localhost:3000", // development mode
        origin: ["http://192.168.0.116:3000", "http://localhost:3000", "https://calling-dudes.web.app"], // development mode
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
            cb(null, uniqueSuffix + "-" + req.body.name + "-" + file.originalname)
        }
    })
})
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.e2cer.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const register = require("./controllers/register")
const peoples = require("./controllers/peoples")
const email = require("./controllers/email")

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html")
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
        app.post("/update-profile", upload.single("image"), (req, res) => {
            if (req.file) {
                req.body.image = req.file.filename;
                const path = __dirname + '/images/' + req.body.old_image
                if (fs.existsSync(path)) {
                    try {
                        fs.unlinkSync(path)
                    } catch (error) {
                        console.log(error.message);
                    }
                } else {
                    console.log(path + " path not exists");
                }
            }else{
                req.body.image = req.body.old_image;
            }
            const userId = req.body._id;
            delete req.body._id;
            delete req.body.old_image;
            users.updateOne({ _id: ObjectId(userId) }, { $set: req.body }).then(insertRes => {
                if (insertRes.modifiedCount) {
                    users.findOne({_id:ObjectId(userId)}).then((userRes) => {
                        res.send(userRes)
                    })
                } else {
                    res.send(insertRes)
                }
            }).catch(err => res.send(err.message))
        })
        app.post("/peoples", peoples(users))
        app.get("/search-people", async (req, res) => {
            users.find({ name: { "$regex": req.query.people, "$options": "i" } }).limit(10).toArray().then(fullfilled => {
                // users.find({ name: req.query.people }).limit(10).toArray().then(fullfilled => {
                res.send(fullfilled);
            }).catch(err => console.log(err.message))
        })

        io.on("connection", async (socket) => {

            socket.on("registered", () => {
                socket.broadcast.emit("newUserFound");
            })
            socket.on("login", (form, cb) => {
                const socketId = socket.id;
                users.findOneAndUpdate(form, { $set: { active: true, socket: socketId } }).then(loginResponse => {
                    cb(loginResponse);
                }).catch(err => cb(err.message))
            })
            socket.on("connect_people", (req) => {
                friends.findOne({ users: { $all: [req.user, req.people] } }).then(findResponse => {
                    if (findResponse === null) {
                        friends.insertOne({ users: [req.user, req.people], lastMessage: Date.now() }).then(async (fullfilled) => {
                            if (fullfilled.acknowledged) {
                                const user1SocketId = await users.findOne({ _id: ObjectId(req.user) })
                                io.to(user1SocketId.socket).emit("new_friend_added_from_people")
                                const user2SocketId = await users.findOne({ _id: ObjectId(req.people) })
                                io.to(user2SocketId.socket).emit("new_friend_added_from_people")
                                // socket.emit("new_friend_added_from_people")
                            }
                        })
                    }
                }).catch(err => console.log(err.message))
            })
            socket.on("get_friends", (data, cb) => {
                friends.find({ users: { $elemMatch: { $eq: data.id } } }).sort({ lastMessage: -1 }).toArray().then(friendsResponse => {
                    friendsResponse.map(fr => {
                        socket.join(fr._id.toString())
                    })
                    cb(friendsResponse)
                }).catch(err => console.log(err.message))
            })
            socket.on("get_user", (id, cb) => {
                users.findOne({ _id: ObjectId(id) }).then(data => {
                    cb(data)
                })
            })
            socket.on("loggedIn", (data) => {
                users.findOneAndUpdate({ _id: ObjectId(data._id) }, { $set: { active: true, socket: socket.id } }).then((res) => {
                    if (res.lastErrorObject.updatedExisting) {
                        socket.broadcast.emit("loggedOn", data._id)
                    }
                }).catch(err => console.log(err.message))
            })
            socket.on("getChat", async (data, cb) => {
                chat.find({ friend_id: data._id }).toArray().then(res => {
                    cb({ chat: res })
                })
            })
            socket.on("sentMessage", (data, cb) => {
                chat.insertOne({
                    friend_id: data.id,
                    sender: data.sender,
                    reciever: data.reciever,
                    message: data.message,
                    lastMessage: Date.now()
                }).then(res => {
                    if (res.acknowledged) {
                        friends.updateOne({ _id: ObjectId(data.id) }, { $set: { lastMessage: Date.now() } }).then(f => {
                            if (f.modifiedCount) {
                                io.to(data.id).emit("message_sent", data.id)
                                cb("done")
                            }
                        })
                    }
                })
            })
            socket.on("delete_frnd_conv", async (data, cb) => {
                friends.deleteOne({ _id: ObjectId(data._id) }).then((frRes) => {
                    if (frRes.deletedCount) {
                        chat.deleteMany({ friend_id: data._id }).then((chatRes) => {
                            socket.emit("conv_deleted_for_user")
                            io.to(data.friend.socket).emit("conv_deleted_for_friend")
                        }).catch(err => console.log(err.message))
                    }
                }).catch(err => console.log(err.message))
            })

            socket.on("disconnect", () => {
                users.findOneAndUpdate({ socket: socket.id }, { $set: { active: false, socket: null } }).then((res) => {
                    if (res.lastErrorObject.updatedExisting) {
                        socket.broadcast.emit("loggedOn", res.value._id)
                    }
                }).catch(err => console.log(err.message))
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