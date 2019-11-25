const router = require('express').Router();



router.use('/auth', require('./auth'));
router.use('/asd', require('./testApi'));
router.use('/files', require('./files'));


module.exports = router;