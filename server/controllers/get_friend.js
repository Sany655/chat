const { ObjectId } = require("mongodb")

module.exports = (users) => ((req, res) => {
    users.findOne({ _id: ObjectId(req.query.friend) }).then(friend => {
        res.send(friend)
    }).catch(err => console.log(err.message))
})