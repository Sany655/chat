const express = require("express")
const app = express()
require("dotenv").config()
const http = require("http")
const server = http.createServer(app)
const { Server } = require("socket.io")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const friends = db.collection("friends");


    io.on("connection", socket => {
        console.log(socket.id + " is connected");

        socket.on("call_peoples", (data) => {
            if (data) {
                io.to(data.friend).to(data.me).emit("call_peoples")
            } else {
                socket.broadcast.emit("call_peoples")
            }
        })
        
        socket.on("call_friends", (data) => {
            io.to(data.friend).to(data.me).emit("call_friends")
        })

        socket.on("connect_friend", (req, cb) => {
            console.log("connect friend emit");
            friends.findOne({ users: { $all: [req.user, req.people._id] } }).then(findResponse => {
                console.log(findResponse);
                if (findResponse === null) {
                    friends.insertOne({ users: [req.user, req.people._id], lastMessage: Date.now() }).then(async (fullfilled) => {
                        console.log(fullfilled);
                        if (fullfilled.acknowledged) {
                            // const user1SocketId = await users.findOne({ _id: ObjectId(req.user) })
                            // io.to(user1SocketId.socket).emit("new_friend_added_from_people")
                            // const user2SocketId = await users.findOne({ _id: ObjectId(req.people) })
                            // io.to(user2SocketId.socket).emit("new_friend_added_from_people")
                            // socket.emit("new_friend_added_from_people")
                            cb(true)
                        } else {
                            cb(false)
                        }
                    })
                }
            }).catch(err => console.log(err.message))
        })

        socket.on("get_friend", (data, cb) => {
            get_user(data).then(user => {
                cb(user)
            })
        })

        socket.on("get_friends", (data, cb) => {
            get_friends(data).then(friendsResponse => {
                cb(friendsResponse)
            }).catch(err => console.log(err.message))
        })

        socket.on("get_peoples", async (data, cb) => {
            const newFriendArr = []
            get_friends(data).then((fri) => {
                fri.map(friend => {
                    const id = friend.users.find(u => u !== data);
                    newFriendArr.push(ObjectId(id))
                })
            }).catch(err => console.log(err.message)).finally(() => {
                users.find({ _id: { $nin: [...newFriendArr, ObjectId(data)] } }).sort({ $natural: -1 }).limit(10).toArray().then(fullfilled => {
                    cb(fullfilled);
                }).catch(err => console.log(err.message))
            })
        })

        async function get_friends(id) {
            return await friends.find({ users: { $elemMatch: { $eq: id } } }).toArray()
        }

        async function get_user(id) {
            return await users.findOne({ _id: ObjectId(id) })
        }

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
            data.active = false;
            data.socket = socket.id;
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
            users.findOneAndUpdate({ email: data.email, password: data.password }, { $set: { active: true, socket: socket.id } }).then(loginResponse => {
                loginResponse.value.active = true;
                loginResponse.value.socekt = socket.id;
                console.log(loginResponse);
                cb(loginResponse);
            }).catch(err => cb(err.message))
        })

        socket.on("disconnect", () => {
            users.findOneAndUpdate({ socket: socket.id }, { $set: { active: false, socket: null, lastActive: Date.now() } }).then((res) => {
                if (res.lastErrorObject.updatedExisting) {
                    // socket.broadcast.emit("loggedOn", res.value._id)
                }
            }).catch(err => console.log(err.message))
            console.log(socket.id + " disconnect");
        })
    })



    console.log("DB connected");
}).catch(err => console.log(err.message));



server.listen(process.env.PORT, () => {
    console.log("http://localhost:" + process.env.PORT);
})