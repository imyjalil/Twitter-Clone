const express = require('express')
const cors = require('cors')
const bodyParser = require("body-parser")
const mongoose = require("./database")



const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT || 3003

const server = app.listen(port, () => console.log('server listening on port:' + port))

const loginRoute = require('./routes/loginRoutes')
const registerRoute = require('./routes/registerRoutes')
const logoutRoute = require('./routes/logoutRoute')

//API routes
const postsApiRoute=require("./routes/api/posts")
const profileAPIRoute=require("./routes/api/profile")
const usersApiRoute=require("./routes/api/users")

app.use("/login", loginRoute)
app.use("/register", registerRoute)
app.use("/logout",logoutRoute)

app.use("/api/posts",postsApiRoute)
app.use("/profile",profileAPIRoute)
app.use("/api/users",usersApiRoute)