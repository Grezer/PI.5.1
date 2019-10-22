const router = require('express').Router()
const moment = require('moment')
const {
  getSome
} = require('../config/showFunctions')


const getOrCreatePoint = async (nickName) => {
  const getUsers = await getSome({
    nickName
  });
  return getUsers;
}


router.route('/users/:nickName').get((req, res, next) => {
  startInitAttendance = getOrCreatePoint(req.params.nickName).then(result => {
    res.send(result);
  }).catch(err => {
    res.send(err);
  })
})

module.exports = router;