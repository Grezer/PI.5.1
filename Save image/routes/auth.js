const router = require('express').Router();
const pool = require('../config/config_db');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

router.post('/login', async (req, res) => {
  const promisePool = pool.promise();
  const findLogin = 'Select * FROM people Where login = ?';
  const [loginExist] = await promisePool.query(findLogin, req.body.login);

  if (loginExist.length == 0)
    return res.status(400).send('Login or password is wrong');

  const validPass = await bcrypt.compare(
    req.body.password,
    loginExist[0].passwordHash
  );

  if (validPass) return res.status(400).send('Login or password is wrong');

  const token = jwt.sign({ id: loginExist[0].id, role: loginExist[0].role}, process.env.TOKEN_SECRET);
  res.header('auth-token', token).send(token);
});

module.exports = router;
