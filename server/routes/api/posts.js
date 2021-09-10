const express = require('express')
const router = express.Router()
const bodyParser = require("body-parser")
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

router.post("/", async (req, res, next) => {
    res.status(200).send("worked")
})

module.exports = router