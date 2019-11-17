const router = require('express').Router();
const pool = require('../config/config_db');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');

// const schema = {
//   nickName: Joi.string()
//     .min(6)
//     .required(),
//   login: Joi.string()
//     .min(6)
//     .required(),
//   passwordHash: Joi.string()
//     .min(6)
//     .required(),
// };

router.post('/register', async (req, res) => {
  //const { error } = await Joi.ValidationError(req.body, schema);
  //if (error) return await res.status(400).send(error.details[0].message);
  //res.send(error.details[0].message);

  const promisePool = pool.promise();

  const findLogin = 'Select * FROM people Where login = ?';
  const loginExist = await promisePool.query(findLogin, req.body.login);
  if (loginExist[0].length != 0)
    return res.status(400).send('Login already exist');

  const salt = bcrypt.genSaltSync(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);

  const people = {
    nickName: req.body.nickName,
    login: req.body.login,
    passwordHash: hashPassword,
    role: req.body.role,
  };

  const sql =
    'INSERT INTO people (nickName, login, passwordHash, role) VALUES (?,?,?,?)';

  await promisePool
    .query(sql, Object.values(people))
    .then(result => {
      console.log(result);
      res.send(result);
    })
    .catch(err => {
      console.log('123123123' + err);
      res.sendStatus(400).send(err);
    });
});

module.exports = router;
