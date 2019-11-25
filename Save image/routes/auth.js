const router = require('express').Router()
const pool = require('../config/config_db')
const Joi = require('@hapi/joi')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
  const { login, password, nickName, role } = req.body
  const promisePool = pool.promise()

  const findLogin = 'Select * FROM people Where login = ?'
  const loginExist = await promisePool.query(findLogin, login)
  if (loginExist[0].length != 0)
    return res.status(400).send('Login already exist')

  //const salt = bcrypt.genSaltSync(10);
  //const hashPassword = await bcrypt.hash(req.body.password, salt);

  const hash = await bcrypt.hash(password, 10)

  // Store hash in database
  const people = {
    nickName,
    login,
    passwordHash: hash,
    role
  }

  const sql =
    'INSERT INTO people (nickName, login, passwordHash, role) VALUES (?,?,?,?)'

  try {
    const result = await promisePool.query(sql, Object.values(people))
    console.log(result)
    res.send(result)
  } catch (err) {
    console.log('123123123' + err)
    res.sendStatus(400).send(err)
  }
})

router.post('/login', async (req, res) => {
  //const hash = '$2a$10$MZVZpD/aJrDLOwjVt4MTt.L32dd0Wg52XMBlk2E2u7.S6YGoDIb.e'
  //const res2 = await bcrypt.compare(req.body.password, hash)

  const promisePool = pool.promise()
  const findLogin = 'Select * FROM people Where login = ?'
  const [loginExist] = await promisePool.query(findLogin, req.body.login)

  if (loginExist.length == 0)
    return res.status(400).send('Login or password is wrong')

  const validPass = await bcrypt.compare(
    req.body.password,
    loginExist[0].passwordHash
  )

  if (!validPass) return res.status(400).send('Login or password is wrong')

  const token = jwt.sign(
    {
      id: loginExist[0].id,
      role: loginExist[0].role
    },
    process.env.TOKEN_SECRET
  )
  res.header('auth-token', token).send(token)
})

module.exports = router
