require('dotenv').config()
const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const router = express.Router()


const app = express()
app.use(express.json());
app.use(require('./routes'));

const pool = require('./config/config_db')





/*
pool.query("SELECT * FROM people", function (err, results) {
  if (err) console.log(err);
  console.log(results);
});
*/


const server = app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on port ' + server.address().port)
})


// переделать на routes index

/*
const authRoute = require('./routes/auth');
app.use('/api/user', authRoute);
*/

module.exports = router
module.exports = app