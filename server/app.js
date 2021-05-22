const express = require('express')
const app = express()
const port = process.env.PORT || 3003

const server = app.listen(port, () => console.log('server listening on port:' + port))