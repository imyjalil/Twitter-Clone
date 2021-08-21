const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
const User = require('../schemas/UserSchema')

router.post("/", async (req, res, next) => {
    var username = req.body.username.trim()
    var password = req.body.password
    let payload = {}
    try {
        const user = await User.findByCredentials(username, password)
        const token = await user.generateAuthToken()
        return res.send({ user, token })
    }
    catch (e) {
        payload.errorMessage = e.message
        console.log(e.message)
        return res.status(400).send(payload)
    }
})

module.exports = router