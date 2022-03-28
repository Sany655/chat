const register = (users) => ((req, res) => {
    req.body.image = req.file.filename;
    users.insertOne(req.body).then(insertRes => {
        if (insertRes.acknowledged) {
            res.send("done");
        } else {
            res.send(insertRes)
        }
    }).catch(err => res.send(err.message))
})

module.exports = register;