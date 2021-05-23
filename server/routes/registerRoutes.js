const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
const User = require('../schemas/UserSchema')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
router.post("/", async (req, res) => {
    var firstName = req.body.firstName.trim()
    var lastName = req.body.lastName.trim()
    var username = req.body.username.trim()
    var email = req.body.email.trim()
    var password = req.body.password
    var payload = req.body
    if (firstName && lastName && username && email && password) {
        var user = await User.findOne({
            $or: [
                { username: username },
                { email: email }
            ]
        })
            .catch((error) => {
                console.log(error);
                payload.errorMessage = "Something went wrong";
                res.status(200);
            })
        if (user == null) {
            var data = req.body
            try {
                user = await User.create(data)
                const token = await user.generateAuthToken()
                return res.status(201).send({ user, token })
            } catch (e) {
                return res.status(400).send(e)
            }
        }
        else {
            if (email == user.email) {
                payload.errorMessage = "Email already in use";
            }
            else {
                payload.errorMessage = "Username already in use";
            }
            return res.status(200).send()
        }
    }
    else {
        payload.errorMessage = "Make sure each field has a valid value."
        return res.status(200).send()
    }
})

module.exports = router