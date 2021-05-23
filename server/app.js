const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const mongoose = require("./database")



const app = express()
app.use(cors())
const port = process.env.PORT || 3003

const server = app.listen(port, () => console.log('server listening on port:' + port))

const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes')


app.use(bodyParser.urlencoded({ extended: false }))
app.use("/login", loginRoute)
app.use("/register", registerRoute)