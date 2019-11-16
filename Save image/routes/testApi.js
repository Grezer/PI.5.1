const router = require('express').Router();
const pool = require('../config/config_db')


router.route('/test').get((req, res, next) => {
  pool.query("SELECT * FROM people", function (err, results) {
    if (err) console.log(err);
    res.send(results);
  });
});


module.exports = router;