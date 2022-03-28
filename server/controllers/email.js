module.exports = (users) => ((req, res) => {
    users.findOne({ email: req.body.email }).then(emailRes => {
        if (emailRes) {
            res.send("true")
        } else {
            res.send("false")
        }
    }).catch(err => console.log(err.message))
})