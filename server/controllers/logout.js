const { ObjectId } = require("mongodb");

module.exports = (users) => ((req,res) => {
    users.findOneAndUpdate({_id:ObjectId(req.body._id)}, { $set: { active: false, socket:"" } }).then(logoutResponse => {
        res.send(logoutResponse);
    }).catch(err => res.send(err.message))
})