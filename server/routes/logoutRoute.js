const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
const User = require('../schemas/UserSchema')
const auth = require('../middleware/auth')

router.get("/", auth, async (req, res, next) => {
    if(req.user && req.token){
        await User.deleteToken(req.user.username, req.token)
        req.user=null
        req.token=null
        //handle destroy token in db
        return res.send({loggedOut:"OK"})
    }
    let payload={}
    payload.errorMessage='Something Went wrong'
    return res.status(400).send(payload)
})

module.exports = router