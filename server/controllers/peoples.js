const { ObjectId } = require("mongodb");

module.exports = (users) => ((req, res) => {
    users.find({ _id: { $ne: ObjectId(req.body._id) } }).sort({ $natural: -1 }).limit(10).toArray().then(fullfilled => {
        res.send(fullfilled);
    })
})