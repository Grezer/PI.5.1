require('dotenv').config()
const express = require('express')
const router = express.Router()

const app = express()
app.use(express.json())
app.use(require('./routes'))

const pool = require('./config/config_db')

const server = app.listen(process.env.PORT || 3000, function() {
  console.log('Listening on port ' + server.address().port)
})

module.exports = router
module.exports = app
