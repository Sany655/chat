module.exports = (users) => ((req, res) => {
    const socketId = req.body.socket;
    delete req.body.socket;
    users.findOneAndUpdate(req.body, { $set: { active: true, socket:socketId } }).then(loginResponse => {
        res.send(loginResponse);
    }).catch(err => res.send(err.message))
})