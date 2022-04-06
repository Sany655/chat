const { ObjectId } = require("mongodb");

module.exports = (users) => ((req, res) => {
    const newFriendArr = []
    req.body.friends.map(friend => {
        newFriendArr.push(ObjectId(friend.users.find(u => u !== req.body._id)))
    })

    users.find({ _id: { $nin: [...newFriendArr,ObjectId(req.body._id)] } }).sort({ $natural: -1 }).limit(10).toArray().then(fullfilled => {
        res.send(fullfilled);
    }).catch(err => console.log(err.message))
})