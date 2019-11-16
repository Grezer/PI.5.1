const router = require('express').Router();



router.use('/auth', require('./auth'));
router.use('/asd', require('./testApi'));


module.exports = router;