module.exports = (friends) => ((req, res) => {
    friends.find({ users: { $elemMatch: { $eq: req.query.user } } }).sort({ lastMessage: -1 }).toArray().then(friendsResponse => {
        res.send(friendsResponse)
    }).catch(err => console.log(err.message))
})