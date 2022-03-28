module.exports = (friends) => ((req, res) => {
    friends.insertOne({ users: [req.body.user, req.body.people], lastMessage: Date.now() }).then(fullfilled => {
        res.send(fullfilled);
    })
})