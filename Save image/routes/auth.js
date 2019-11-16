const router = require('express').Router();
const pool = require('../config/config_db')

router.post('/register', async (req, res) => {
  const promisePool = pool.promise();
  const people = {
    nickName: req.body.nickName,
    login: req.body.login,
    passwordHash: req.body.passwordHash,
    role: req.body.role
  }

  const sql = "INSERT INTO people (nickName, login, passwordHash, role) VALUES (?,?,?,?)";

  await promisePool.query(sql, Object.values(people))
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.log("123123123" + err);
      res.sendStatus(400).send(err);
    });
});





module.exports = router;